import test from 'node:test';
import assert from 'node:assert/strict';
import {studyDate,summarizeStudy,type StudySummary} from '../packages/domain/src/study.ts';
import {handleAtlasForPlayer,type Expedition} from '../lib/atlas/service.ts';
import {StorageUnavailable,type ExpeditionStore,type ExpeditionRow} from '../lib/atlas/storage.ts';
import {emptyProgress} from '../packages/domain/src/index.ts';
import {studyFor} from '../lib/atlas/study.ts';

function setup(){
 const rows=new Map<string,ExpeditionRow>();let now=new Date('2026-10-03T09:00:00Z'),fail=false,conflicts=0;
 const store:ExpeditionStore={provider:'supabase',async initialize(id,document){if(!rows.has(id))rows.set(id,{revision:0,document});},async read(id){const row=rows.get(id);return row?{...row}:null;},async compareAndSwap(id,revision,document){if(fail)throw new StorageUnavailable('TEST_ROLLBACK');if(conflicts>0){conflicts--;return false;}const current=rows.get(id);if(!current||current.revision!==revision)return false;rows.set(id,{revision:revision+1,document});return true;}};
 async function call(path:string,body?:unknown,owner:string|null='alice',origin='https://atlas.test'){
  const response=await handleAtlasForPlayer(new Request('https://atlas.test/api/'+path,{method:body===undefined?'GET':'POST',headers:{origin,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})}),store,owner,()=>now);
  return {status:response.status,body:await response.json() as {id:string;correct:boolean;studyHistory:StudySummary}};
 }
 return {rows,call,setDate:(date:string)=>{now=new Date(date);},setFailure:(value:boolean)=>{fail=value;},setConflicts:(n:number)=>{conflicts=n;}};
}
const travel=(stepId:string,action:unknown)=>({encounterId:'jp-arrival',version:1,stepId,band:'A2',support:{vietnamese:false,glossary:false},action});
test('Vietnam day boundary, leap dates, consecutive days, gaps, best and future filtering',()=>{
 assert.equal(studyDate(new Date('2026-10-03T16:59:59Z')),'2026-10-03');
 assert.equal(studyDate(new Date('2026-10-03T17:00:00Z')),'2026-10-04');
 const days=['2026-10-02','2026-10-03','2026-10-03','2026-10-01','bad','2026-02-30','2099-01-01'];
 const a=summarizeStudy(days,new Date('2026-10-03T09:00:00Z'));assert.equal(a.currentStreak,3);assert.equal(a.totalDays,3);assert.equal(a.longestStreak,3);
 assert.equal(summarizeStudy(days,new Date('2026-10-04T09:00:00Z')).currentStreak,3);
 assert.equal(summarizeStudy(days,new Date('2026-10-05T09:00:00Z')).currentStreak,0);
 assert.equal(summarizeStudy(['2024-02-28','2024-02-29','2024-03-01'],new Date('2024-03-01T00:00:00Z')).longestStreak,3);
});
test('login, navigation, invalid, stale and unauthenticated requests do not mark learning',async()=>{
 const s=setup();
 assert.equal((await s.call('study',undefined,null)).status,401);assert.equal(s.rows.size,0);
 const unfinished=(await s.call('attempts',{missionId:'silent-forest'})).body;
 await s.call('attempts/'+unfinished.id+'/submit',{type:'DISCOVERY',answer:'linked'});
 await s.call('attempts/'+unfinished.id+'/submit',{type:'DISCOVERY',answer:'invented'});
 await s.call('session',{});await s.call('state');await s.call('travel/start',{countryId:'JP'});await s.call('attempts',{missionId:'silent-forest'});
 assert.equal((await s.call('study')).body.studyHistory.totalDays,0);
 assert.equal((await s.call('travel/action',travel('read-signs',{kind:'inspect',target:'invented'}))).status,400);
 await s.call('travel/action',travel('ask-staff',{kind:'say',choice:'ask'})); // out of order, no real evaluation
 assert.equal((await s.call('study')).body.studyHistory.totalDays,0);
 assert.equal((await s.call('travel/action',{...travel('read-signs',{kind:'inspect',target:'signs'}),date:'2026-01-01'})).status,400);
 assert.equal((await s.call('study')).body.studyHistory.totalDays,0);
});
test('32 duplicate clue saves mark one date; resume, next day, gap and owner isolation',async()=>{
 const s=setup();const attempt=(await s.call('attempts',{missionId:'silent-forest'})).body;
 const replies=await Promise.all(Array.from({length:32},()=>s.call('attempts/'+attempt.id+'/observe',{clueId:'canopy'})));
 assert.ok(replies.every(r=>r.status===201));const doc=JSON.parse(s.rows.get('alice')!.document);
 assert.deepEqual(doc.studyHistory.days,['2026-10-03']);assert.equal(doc.progress.xp,0);assert.equal(doc.ledger.length,0);
 assert.equal((await s.call('study')).body.studyHistory.currentStreak,1);
 assert.equal((await s.call('study',undefined,'bob')).body.studyHistory.totalDays,0);
 s.setDate('2026-10-04T09:00:00Z');await s.call('attempts/'+attempt.id+'/observe',{clueId:'stream'});
 assert.equal((await s.call('study')).body.studyHistory.currentStreak,2);
 s.setDate('2026-10-06T09:00:00Z');assert.equal((await s.call('study')).body.studyHistory.currentStreak,0);
 await s.call('attempts/'+attempt.id+'/observe',{clueId:'wildlife'});
 const history=(await s.call('study')).body.studyHistory;
 assert.equal(history.currentStreak,1);assert.equal(history.longestStreak,2);assert.equal(history.totalDays,3);
 assert.ok(history.days.includes('2026-10-03'));
});
test('wrong evaluated travel answer counts effort; invalid/stale retries and restarts do not',async()=>{
 const s=setup();await s.call('travel/action',travel('read-signs',{kind:'inspect',target:'signs'}));
 s.setDate('2026-10-04T09:00:00Z');
 const wrong=await s.call('travel/action',travel('ask-staff',{kind:'say',choice:'food'}));assert.equal(wrong.body.correct,false);
 const h=(await s.call('study')).body.studyHistory;assert.equal(h.currentStreak,2);
 s.setDate('2026-10-05T09:00:00Z');await s.call('travel/action',travel('read-signs',{kind:'inspect',target:'signs'}));
 assert.equal((await s.call('study')).body.studyHistory.totalDays,2);
});
test('failed persistence never creates a day; CAS retry retains one atomic learning save',async()=>{
 const s=setup();const attempt=(await s.call('attempts',{missionId:'silent-forest'})).body;
 const before=s.rows.get('alice')!.document;
 s.setFailure(true);assert.equal((await s.call('attempts/'+attempt.id+'/observe',{clueId:'canopy'})).status,503);assert.equal(s.rows.get('alice')!.document,before);
 s.setFailure(false);s.setConflicts(2);assert.equal((await s.call('attempts/'+attempt.id+'/observe',{clueId:'canopy'})).status,201);
 assert.equal((await s.call('study')).body.studyHistory.totalDays,1);
});
test('legacy learning timestamps can show 03/10/2026; login and attempt timestamps cannot',()=>{
 const d:Expedition={progress:emptyProgress(),attempts:[{id:'a',missionId:'silent-forest',version:1,observed:[],status:'ACTIVE',createdAt:'2026-10-01T00:00:00Z'}],ledger:[],submissions:[{payload:{type:'ENGLISH_ITEM'},createdAt:'2026-10-03T12:00:00Z'}]};
 const before=JSON.stringify(d),h=studyFor(d,new Date('2026-10-04T00:00:00Z'));
 assert.deepEqual(h.days,['2026-10-03']);assert.equal(JSON.stringify(d),before);
});
