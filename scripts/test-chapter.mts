import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {chapterLessons,readingBands} from '../content/english/chapter.ts';
import {evaluateEnglishItem} from '../packages/english-engine/src/chapter.ts';
import {handleAtlas} from '../lib/atlas/service.ts';
const answers={
 'forest-field-note':{A1:{read:'water',word:'cover'},A2:{read:'inspect',word:'cover'},B1:{read:'sites',word:'cover'},B2:{read:'qualified',word:'cover'}},
 'lake-field-note':{A1:{read:'evidence',word:'measure'},A2:{read:'evidence',word:'measure'},B1:{read:'evidence',word:'measure'},B2:{read:'evidence',word:'measure'}},
 'grove-field-note':{A1:{read:'pause',word:'order'},A2:{read:'pause',word:'order'},B1:{read:'pause',word:'order'},B2:{read:'pause',word:'order'}},
} as const;
function payload(lessonId:string,band:'A1'|'A2'|'B1'|'B2',itemId:'read'|'word',answer:string){return {lessonId,version:1,band,itemId,answer,support:{vietnamese:true,glossary:true}};}
let variants=0;
for(const l of chapterLessons)for(const band of readingBands){
 assert.equal(l.variants[band].questions.length,2);assert.ok(l.glossary.length>=4);
 for(const q of l.variants[band].questions){
  const key=answers[l.id as keyof typeof answers][band][q.id];
  const good=evaluateEnglishItem(payload(l.id,band,q.id,key));assert.equal(good.correct,true);assert.equal(good.awardedXp,0);assert.ok(good.explanationVi.length>25);assert.ok(l.variants[band].passage.includes(good.quote),`${l.id}/${band}/${q.id} has a nonliteral evidence excerpt: ${good.quote}`);
  const wrong=q.options.find(o=>o.id!==key)!;assert.equal(evaluateEnglishItem(payload(l.id,band,q.id,wrong.id)).correct,false);variants++;
 }
}
const require=createRequire(import.meta.resolve('wrangler'));const {Miniflare}=require('miniflare');
const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("test")}}',compatibilityDate:'2026-05-15',d1Databases:['DB']});
try{
 const db=await mf.getD1Database('DB');await db.prepare(await readFile(new URL('../drizzle/0000_parallel_guardian.sql',import.meta.url),'utf8')).run();
 const call=async(path:string,data?:unknown,user='chapter-player')=>{const response=await handleAtlas(new Request(`https://atlas.test/api/${path}`,{method:data===undefined?'GET':'POST',headers:{'oai-authenticated-user-id':user,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})}),db);return {status:response.status,body:await response.json() as any};};
 await call('session',{});let ids:string[]=[];
 for(const l of chapterLessons){
  const start=await call('attempts',{missionId:l.missionId});assert.equal(start.status,201);const id=start.body.id;ids.push(id);
  if(l.missionId!=='restore-ecosystem'){
   assert.equal((await call(`attempts/${id}/english-item`,payload(l.id,'A2','read',answers[l.id as keyof typeof answers].A2.read))).status,400);
   const clues=l.missionId==='silent-forest'?['canopy','stream','wildlife']:['temperature','oxygen','screen'];for(const clueId of clues)await call(`attempts/${id}/observe`,{clueId});
  }
  assert.equal((await call(`attempts/${id}/english-item`,payload(l.id,'A2','read',answers[l.id as keyof typeof answers].A2.read),'different-player')).status,404);
  const wrong=l.variants.A2.questions[1].options.find(o=>o.id!==answers[l.id as keyof typeof answers].A2.word)!;
  const bad=await call(`attempts/${id}/english-item`,payload(l.id,'A2','word',wrong.id));assert.equal(bad.body.correct,false);assert.equal(bad.body.newEvidence,0);assert.ok(bad.body.correctText);assert.ok(bad.body.quote);
  const reading=await call(`attempts/${id}/english-item`,payload(l.id,'A2','read',answers[l.id as keyof typeof answers].A2.read));assert.equal(reading.body.correct,true);assert.equal(reading.body.state.englishReview.find((r:any)=>r.lessonId===l.id&&r.itemId==='word').correct,false);
  const wordPayload=payload(l.id,'A2','word',answers[l.id as keyof typeof answers].A2.word);
  const many=await Promise.all(Array.from({length:8},()=>call(`attempts/${id}/english-item`,wordPayload)));assert.equal(many.reduce((sum,r)=>sum+r.body.newEvidence,0),1);
  const after=(await call('state')).body;assert.equal(after.englishReview.find((r:any)=>r.lessonId===l.id&&r.itemId==='word').correct,true);
  const subject=l.missionId==='silent-forest'?{type:'DISCOVERY',answer:'linked'}:l.missionId==='disappearing-lake'?{type:'REASONING',answer:'oxygen-stress',evidence:['oxygen-response','warm-reference']}:{type:'PUZZLE',sequence:['aerate','shade','monitor','restock'],transfer:'reassess'};
  assert.equal((await call(`attempts/${id}/submit`,subject)).body.correct,true);
 }
 const state=(await call('session',{})).body;assert.equal(state.xp,210);assert.equal(state.englishEvidence.length,6);assert.equal(state.completed.length,3);assert.equal(state.restored,true);assert.equal(state.mastery,'PROFICIENT');assert.equal(state.englishMastery.speaking.status,'NOT_ASSESSED');assert.equal(state.englishMastery.cefrProficiency,null);assert.deepEqual(state.ledger.map((e:any)=>e.amount),[30,60,120]);assert.equal(state.attempts.length,3);assert.ok(state.englishReview.every((r:any)=>r.correct));
 for(const mutation of [{version:2},{band:'C2'},{xp:99},{itemId:'speaking'},{answer:'made-up'}])assert.equal((await call(`attempts/${ids[0]}/english-item`,{...payload('forest-field-note','A2','read','inspect'),...mutation})).status,400);
 assert.equal((await call(`attempts/${ids[0]}/english-item`,payload('lake-field-note','A2','read','evidence'))).status,400);
 assert.equal((await call(`attempts/${ids[0]}/english-item`,payload('forest-field-note','A2','read','inspect'))).body.newEvidence,0);
 assert.equal((await call('state',undefined,'different-player')).body.englishEvidence.length,0);
 console.log(`PASS: ${variants} band/item grading + literal evidence excerpts; actual D1 full bilingual chapter; per-item retry/review state; 8 concurrent item submits; strict versions; isolation; 210 XP and six unique English items; old attempts retained.`);
}finally{await mf.dispose();}
