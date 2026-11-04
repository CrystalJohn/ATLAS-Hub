import assert from 'node:assert/strict';
import {createLocalStack,ids} from './auth02/local-stack.mts';
import {handleVercelAtlas} from '../lib/atlas/vercel-handler.ts';
import {handleAtlasForPlayer,type Expedition} from '../lib/atlas/service.ts';
import {supabaseExpeditionStore} from '../lib/atlas/supabase-storage.ts';
import {StorageUnavailable,type ExpeditionStore} from '../lib/atlas/storage.ts';
import type {StudySummary} from '../packages/domain/src/study.ts';
import {mkdir,writeFile} from 'node:fs/promises';
const stack=await createLocalStack(),checks:string[]=[];
let now=new Date('2026-10-03T09:00:00Z');
const store=supabaseExpeditionStore(stack.admin);
const row=async()=>{const r=await stack.sql.query('select revision,document from public.atlas_expeditions where player_id=$1',[ids.alice]);return {revision:Number(r.rows[0].revision),document:JSON.parse(r.rows[0].document) as Expedition};};
async function call(path:string,body?:unknown,selectedStore:ExpeditionStore=store,owner=ids.alice){
 const r=await handleAtlasForPlayer(new Request('https://atlas.test/api/'+path,{method:body===undefined?'GET':'POST',headers:{origin:'https://atlas.test','Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})}),selectedStore,owner,()=>now);
 return {status:r.status,body:await r.json() as {id:string;studyHistory:StudySummary}};
}
try{
 for(const id of [ids.alice,ids.bob]){
  const r=await handleVercelAtlas(new Request('https://atlas.test/api/session',{method:'POST',headers:{origin:'https://atlas.test','Content-Type':'application/json'},body:'{}'}),{getAdmin:()=>stack.admin,getUser:async()=>stack.user(id)});assert.equal(r.status,200);
 }
 assert.equal((await call('study')).body.studyHistory.totalDays,0);
 const attempt=(await call('attempts',{missionId:'silent-forest'})).body;
 const replies=await Promise.all(Array.from({length:32},()=>call('attempts/'+attempt.id+'/observe',{clueId:'canopy'})));
 assert(replies.every(r=>r.status===201));
 let saved=await row();assert.deepEqual(saved.document.studyHistory?.days,['2026-10-03']);assert.equal(saved.document.progress.xp,0);assert.deepEqual(saved.document.ledger,[]);
 checks.push('32 concurrent saves commit exactly one date in PostgreSQL, with 0 XP and unchanged empty ledger');
 const resumed=await call('study',undefined,supabaseExpeditionStore(stack.admin));assert.deepEqual(resumed.body.studyHistory.days,['2026-10-03']);checks.push('Fresh store object resumes persisted date and streak');
 assert.equal((await call('study',undefined,store,ids.bob)).body.studyHistory.totalDays,0);checks.push('Second verified account has independent empty history');
 const lostBefore=JSON.stringify(await row());await call('attempts/'+attempt.id+'/observe',{clueId:'canopy'});assert.equal(JSON.stringify(await row()),lostBefore);checks.push('Retry after lost clue response leaves date and authoritative revision unchanged');
 now=new Date('2026-10-04T09:00:00Z');
 const broken:ExpeditionStore={...store,async compareAndSwap(){throw new StorageUnavailable('TEST_ROLLBACK');}};
 assert.equal((await call('attempts/'+attempt.id+'/observe',{clueId:'stream'},broken)).status,503);
 assert.equal(JSON.stringify(await row()),lostBefore);checks.push('Storage failure rolls back both clue and study day');
 await call('attempts/'+attempt.id+'/observe',{clueId:'stream'});saved=await row();
 assert.deepEqual(saved.document.studyHistory?.days,['2026-10-03','2026-10-04']);assert.equal((await call('study')).body.studyHistory.currentStreak,2);checks.push('Second local day accumulates a 2-day streak');
 const unauth=await handleVercelAtlas(new Request('https://atlas.test/api/study'),{getAdmin:()=>stack.admin,getUser:async()=>null});assert.equal(unauth.status,401);checks.push('Unauthenticated calendar read denied');
 const evidence={pass:true,postgres:stack.info.postgres,checks,sql:{revision:saved.revision,studyHistory:saved.document.studyHistory,xp:saved.document.progress.xp,ledger:saved.document.ledger}};
 await mkdir('output/study-calendar',{recursive:true});await writeFile('output/study-calendar/postgres-evidence.json',JSON.stringify(evidence,null,2));
 console.log('PASS study calendar PostgreSQL: '+checks.length+' oracles.');console.log(checks.join('\n'));
}finally{await stack.close();}
