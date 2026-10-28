import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';

import {adaptC0Fixture,C0FixtureSchema} from '../content/tower/c0-fixture-adapter.ts';
import {createTowerEngine} from '../packages/tower-engine/src/index.ts';
import type {TowerRun,TowerState,TransitionResult,ErrorCode} from '../content/tower/types.ts';

const raw=JSON.parse(readFileSync(new URL('../docs/game-01/c0/C0-question-bank-candidates.json',import.meta.url),'utf8'));
const authoring=C0FixtureSchema.parse(raw);
const adapted=adaptC0Fixture(raw);
const engine=createTowerEngine(adapted.definition,adapted.answerKeys);
function accepted(result:TransitionResult):TowerRun{
  assert.ok(result.ok,result.ok?'':JSON.stringify(result.error));
  assert.notEqual(result.state.status,'NOT_STARTED');
  return result.state as TowerRun;
}
function rejected(result:TransitionResult,state:TowerState,code:ErrorCode){
  assert.equal(result.ok,false);if(result.ok)throw new Error('Expected rejection');
  assert.equal(result.error.code,code);assert.equal(result.error.isLanguageMistake,false);
  assert.strictEqual(result.state,state);
}
const start=(seed=7,id='run-1')=>accepted(engine.start(engine.initialState(),{runId:id,seed}));
const target=(s:TowerRun)=>({runId:s.runId,expectedRunRevision:s.revision,
  questionId:s.pinned[s.clearedFloors].id,questionRevision:s.pinned[s.clearedFloors].revision});
function prepared(s:TowerRun,wrongParts:string[]=[]){
  const q=authoring.records.find(q=>q.id===s.pinned[s.clearedFloors].id)!;
  const answers=q.parts.map(p=>({partId:p.id,choiceId:wrongParts.includes(p.id)?p.options.find(o=>o.id!==p.answerId)!.id:p.answerId}));
  let selected=s;
  for(const a of answers)selected=accepted(engine.select(selected,{...target(selected),...a}));
  const command={...target(selected),operationId:`op-${s.clearedFloors+1}`,confirmed:true as const,answers};
  return {selected,command};
}
function answer(s:TowerRun,wrong:string[]=[]){
  const p=prepared(s,wrong),result=engine.submit(p.selected,p.command);
  return {...p,result,state:accepted(result)};
}
function atFloor(floor:number,seed=7){let s=start(seed);while(s.clearedFloors<floor-1)s=answer(s).state;return s;}

test('C0 exact draft inventory, provenance and revisions survive the adapter',()=>{
  assert.equal(authoring.records.length,12);
  assert.equal(authoring.records.reduce((n,q)=>n+q.parts.length,0),14);
  assert.deepEqual([1,2,3,4,5].map(f=>adapted.definition.questions.filter(q=>q.floor===f).length),[4,2,2,2,2]);
  for(const q of adapted.definition.questions){
    const k=adapted.answerKeys.questions.find(k=>k.id===q.id)!;
    const reconstructed={...q,parts:q.parts.map(p=>{const part=k.parts.find(k=>k.id===p.id)!;
      return {...p,answerId:part.answerId,options:p.options.map(o=>({...o,rationale:part.feedback.find(f=>f.choiceId===o.id)!.rationale}))};})};
    assert.deepEqual(reconstructed,authoring.records.find(a=>a.id===q.id));
    assert.equal(q.review.educatorSignoff,null);assert.equal(q.status,'DRAFT');
  }
  assert.equal(adapted.definition.origin.sourceCommit,authoring.sourceCommit);
  assert.equal(adapted.definition.publicationEligible,false);assert.equal(adapted.definition.rewardPolicy,'DISABLED');
  assert.match(adapted.definition.origin.provenanceDocument,/C0-learning-objectives-and-provenance\.md$/);
});

test('NOT_STARTED -> start pins five floors and two boss parts',()=>{
  const initial=engine.initialState();assert.deepEqual(initial,{status:'NOT_STARTED'});
  const s=start();assert.equal(s.status,'IN_PROGRESS');assert.equal(s.clearedFloors,0);assert.equal(s.advancedDecisions,0);
  assert.equal(s.revision,0);assert.equal(s.receipts.length,0);assert.equal(s.pinned.length,5);
  assert.deepEqual(s.pinned.map(q=>q.parts.length),[1,1,1,1,2]);
  rejected(engine.start(s,{runId:'new',seed:3}),s,'INVALID_STATE');
});

test('invalid seeds and actions before start or after completion cannot create scoring transitions',()=>{
  const initial=engine.initialState(),p=prepared(start());
  for(const seed of [-1,0.5,0x100000000,NaN])rejected(engine.start(initial,{runId:'r',seed}),initial,'INVALID_REQUEST');
  rejected(engine.submit(initial,p.command),initial,'INVALID_STATE');
  rejected(engine.select(initial,{...target(p.selected),partId:'p1',choiceId:'c1'}),initial,'INVALID_STATE');
  const final=answer(atFloor(5)).state;
  rejected(engine.restart(final,{runId:'new',seed:0,previousRunId:final.runId,expectedRunRevision:final.revision}),final,'INVALID_STATE');
});

test('normal five-floor completion advances six decisions and exactly five floors',()=>{
  let s=start();const pins=structuredClone(s.pinned);
  for(let floor=1;floor<=5;floor++){
    const before=s,r=answer(s);s=r.state;
    assert.equal(before.clearedFloors,floor-1);assert.equal(s.clearedFloors,floor);
    assert.equal(s.revision,floor);assert.equal(s.receipts.length,floor);
    assert.equal(s.advancedDecisions,floor===5?6:floor);
    assert.deepEqual(s.pinned,pins);assert.equal(s.status,floor===5?'COMPLETED':'IN_PROGRESS');
  }
  assert.equal(engine.present(s).question,undefined);
});

for(let floor=1;floor<=5;floor++)test(`confirmed wrong answer at Floor ${floor} terminates only this run`,()=>{
  const before=atFloor(floor),pins=structuredClone(before.pinned),r=answer(before,['p1']);
  assert.equal(r.state.status,'FAILED');assert.equal(r.state.clearedFloors,floor-1);
  assert.equal(r.state.advancedDecisions,floor-1);assert.deepEqual(r.state.pinned,pins);
  assert.equal(r.state.receipts.at(-1)!.parts[0].correct,false);
  rejected(engine.submit(r.state,{...r.command,operationId:'late'}),r.state,'INVALID_STATE');
  rejected(engine.select(r.state,{...target(before),partId:'p1',choiceId:'c1'}),r.state,'INVALID_STATE');
});

for(const [label,wrong,prefix] of [
  ['TT',[],6],['TF',['p2'],5],['FT',['p1'],4],['FF',['p1','p2'],4],
] as const)test(`atomic boss ${label}: honest per-part feedback, prefix ${prefix}, no partial floor`,()=>{
  const s=atFloor(5),r=answer(s,[...wrong]),parts=r.state.receipts.at(-1)!.parts;
  assert.equal(r.state.status,label==='TT'?'COMPLETED':'FAILED');
  assert.equal(r.state.clearedFloors,label==='TT'?5:4);assert.equal(r.state.advancedDecisions,prefix);
  assert.deepEqual(parts.map(p=>p.correct),[!wrong.some(x=>x==='p1'),!wrong.some(x=>x==='p2')]);
  assert.deepEqual(parts.map(p=>p.advancesDecision),[label[0]==='T',label==='TT']);
  assert.equal(r.state.receipts.length,5);assert.equal(r.state.revision,5);
  for(const p of parts){assert.ok(p.selectedExplanation.en&&p.correctExplanation.vi&&p.sourceRefs.length&&p.remediationId);}
});

test('one correct boss selection never grades/advances; both must be selected and confirmed',()=>{
  const s=atFloor(5),q=authoring.records.find(q=>q.id===s.pinned[4].id)!;
  const first={partId:'p1',choiceId:q.parts[0].answerId};
  const selected=accepted(engine.select(s,{...target(s),...first}));
  assert.equal(selected.status,'IN_PROGRESS');assert.equal(selected.clearedFloors,4);
  assert.equal(selected.advancedDecisions,4);assert.equal(selected.revision,s.revision);assert.equal(selected.receipts.length,4);
  rejected(engine.submit(selected,{...target(s),confirmed:true,operationId:'partial',answers:[first]}),selected,'INVALID_CHOICE');
  rejected(engine.submit(selected,{...target(s),confirmed:true,operationId:'partial',answers:q.parts.map(p=>({partId:p.id,choiceId:p.answerId}))}),selected,'INCOMPLETE_SELECTION');
});

test('unconfirmed/wrong draft can be changed safely; submit must match reviewed selection',()=>{
  const s=start(),wrong=prepared(s,['p1']);assert.equal(wrong.selected.status,'IN_PROGRESS');
  assert.equal(wrong.selected.revision,0);assert.equal(wrong.selected.advancedDecisions,0);
  rejected(engine.submit(wrong.selected,{...wrong.command,confirmed:false}),wrong.selected,'INVALID_REQUEST');
  const right=prepared(s);
  rejected(engine.submit(wrong.selected,right.command),wrong.selected,'SELECTION_MISMATCH');
  assert.equal(answer(wrong.selected).state.clearedFloors,1);
});

test('failed restart requires new identity, resets only run counters and uses new record in every floor',()=>{
  const failed=answer(atFloor(4),['p1']).state,snapshot=structuredClone(failed);
  const cmd={runId:'run-2',seed:7,previousRunId:failed.runId,expectedRunRevision:failed.revision};
  rejected(engine.restart(failed,{...cmd,runId:failed.runId}),failed,'RUN_ID_REUSED');
  rejected(engine.restart(failed,{...cmd,previousRunId:'other'}),failed,'WRONG_RUN');
  rejected(engine.restart(failed,{...cmd,expectedRunRevision:0}),failed,'STALE_REVISION');
  const next=accepted(engine.restart(failed,cmd));
  assert.equal(next.runId,'run-2');assert.equal(next.status,'IN_PROGRESS');assert.equal(next.clearedFloors,0);
  assert.equal(next.advancedDecisions,0);assert.equal(next.revision,0);assert.equal(next.receipts.length,0);
  assert.equal(next.assignmentHistory.length,2);assert.deepEqual(failed,snapshot);
  next.pinned.forEach((p,i)=>assert.notEqual(p.id,failed.pinned[i].id));
  const failedAgain=answer(next,['p1']).state;
  rejected(engine.restart(failedAgain,{...cmd,runId:'run-1',previousRunId:'run-2',expectedRunRevision:1}),failedAgain,'RUN_ID_REUSED');
  const active=start();rejected(engine.restart(active,{...cmd}),active,'INVALID_STATE');
});

test('wrong run/question/revision, out-of-order and invalid choices are non-language errors',()=>{
  const s=start(),p=prepared(s);
  rejected(engine.submit(p.selected,{...p.command,runId:'other'}),p.selected,'WRONG_RUN');
  rejected(engine.submit(p.selected,{...p.command,questionId:s.pinned[1].id}),p.selected,'WRONG_QUESTION');
  rejected(engine.submit(p.selected,{...p.command,questionRevision:99}),p.selected,'WRONG_QUESTION');
  rejected(engine.submit(p.selected,{...p.command,expectedRunRevision:99}),p.selected,'STALE_REVISION');
  rejected(engine.submit(p.selected,{...p.command,answers:[{partId:'p1',choiceId:'unknown'}]}),p.selected,'INVALID_CHOICE');
  rejected(engine.select(s,{...target(s),partId:'unknown',choiceId:'c1'}),s,'INVALID_CHOICE');
  rejected(engine.select(s,{...target(s),partId:'p1',choiceId:'unknown'}),s,'INVALID_CHOICE');
  const next=accepted(engine.submit(p.selected,p.command));
  rejected(engine.submit(next,{...p.command,operationId:'new-op',expectedRunRevision:next.revision}),next,'WRONG_QUESTION');
});

test('duplicate/lost-response retry returns original receipt before stale or terminal checks',()=>{
  const r=answer(start()),receipt=r.state.receipts[0];
  for(let i=0;i<32;i++){
    const replay=engine.submit(r.state,{...r.command,expectedRunRevision:999});
    assert.ok(replay.ok);assert.equal(replay.replayed,true);assert.strictEqual(replay.state,r.state);assert.deepEqual(replay.receipt,receipt);
  }
  const later=answer(r.state).state,replay=engine.submit(later,r.command);
  assert.ok(replay.ok);assert.strictEqual(replay.state,later);assert.deepEqual(replay.receipt,receipt);
  const wrong=answer(start(),['p1']),terminalReplay=engine.submit(wrong.state,wrong.command);
  assert.ok(terminalReplay.ok);assert.equal(terminalReplay.replayed,true);assert.equal(terminalReplay.state.status,'FAILED');
  const final=answer(atFloor(5)),finalReplay=engine.submit(final.state,{...final.command,answers:[...final.command.answers].reverse()});
  assert.ok(finalReplay.ok);assert.equal(finalReplay.replayed,true);assert.equal(finalReplay.state.status,'COMPLETED');
  rejected(engine.submit(final.state,{...final.command,operationId:'late-new-op'}),final.state,'INVALID_STATE');
});

test('operation collision, duplicate part IDs and cross-run retries cannot regrade',()=>{
  const r=answer(start()),changed={...r.command,answers:[{partId:'p1',choiceId:'different'}]};
  rejected(engine.submit(r.state,changed),r.state,'OPERATION_CONFLICT');
  const boss=prepared(atFloor(5));
  rejected(engine.submit(boss.selected,{...boss.command,answers:[boss.command.answers[0],boss.command.answers[0]]}),boss.selected,'INVALID_CHOICE');
  const other=start(2,'other-run');rejected(engine.submit(other,r.command),other,'WRONG_RUN');
});

test('strict commands reject client correctness, XP, keys and service-error objects without consuming run',()=>{
  const p=prepared(start());
  for(const extra of [{correct:true},{xp:999},{answerId:'c1'},{playerId:'spoof'},{floor:5},{answerKeys:adapted.answerKeys}]){
    rejected(engine.submit(p.selected,{...p.command,...extra}),p.selected,'INVALID_REQUEST');
  }
  for(const input of [null,{}, {error:'NETWORK_TIMEOUT'}, {error:'SERVICE_UNAVAILABLE'}, {...p.command,answers:[]}, {...p.command,confirmed:undefined}]){
    rejected(engine.submit(p.selected,input),p.selected,'INVALID_REQUEST');
  }
  assert.equal(accepted(engine.submit(p.selected,p.command)).clearedFloors,1);
});

test('pure deterministic transitions, frozen outputs, and non-mutation of all caller inputs',()=>{
  const a=adaptC0Fixture(raw),aBefore=structuredClone(a),e=createTowerEngine(a.definition,a.answerKeys);
  const initial=e.initialState(),cmd={runId:'deterministic',seed:42},cmdBefore=structuredClone(cmd);
  const s=accepted(e.start(initial,cmd));assert.deepEqual(e.start(initial,cmd),e.start(initial,cmd));
  assert.deepEqual(a,aBefore);assert.deepEqual(cmd,cmdBefore);assert.deepEqual(initial,{status:'NOT_STARTED'});
  assert.equal(Object.isFrozen(s),true);assert.equal(Object.isFrozen(s.pinned[0].parts[0].choiceOrder),true);
  const p=prepared(s),snapshot=structuredClone(p.selected),payload=structuredClone(p.command);
  assert.deepEqual(e.submit(p.selected,p.command),e.submit(p.selected,p.command));
  assert.deepEqual(p.selected,snapshot);assert.deepEqual(p.command,payload);
  a.definition.questions[0].stimulus.en='changed after factory';a.answerKeys.questions[0].parts[0].answerId='tampered';
  assert.deepEqual(e.present(s),engine.present(s));assert.deepEqual(e.submit(p.selected,p.command),engine.submit(p.selected,p.command));
});

test('JSON round-trip retains pins and same-operation recovery; different manifest cannot grade active run',()=>{
  const r=answer(start()),restored=JSON.parse(JSON.stringify(r.state)) as TowerRun;
  assert.deepEqual(engine.present(restored),engine.present(r.state));
  const replay=engine.submit(restored,r.command);assert.ok(replay.ok);assert.equal(replay.replayed,true);
  const altered=adaptC0Fixture(raw);altered.definition.questions[0].stimulus.en+=' revised';
  const other=createTowerEngine(altered.definition,altered.answerKeys),p=prepared(restored);
  rejected(other.submit(p.selected,p.command),p.selected,'CONTENT_MISMATCH');
  assert.throws(()=>other.present(restored),/CONTENT_MISMATCH/);
  // A historical receipt remains valid evidence even if a newer evaluator is loaded.
  const old=other.submit(restored,r.command);assert.ok(old.ok);assert.equal(old.replayed,true);
});

test('different seeds choose valid variants and order; every fixture can be sampled',()=>{
  const seen=new Set<string>(),orders=new Set<string>();
  for(let seed=0;seed<128;seed++){
    const s=start(seed,`seed-${seed}`);assert.deepEqual(start(seed,`seed-${seed}`),s);
    s.pinned.forEach((pin,i)=>{
      seen.add(pin.id);const q=authoring.records.find(q=>q.id===pin.id)!;
      assert.equal(q.floor,i+1);assert.equal(q.revision,pin.revision);
      pin.parts.forEach((p,j)=>assert.deepEqual([...p.choiceOrder].sort(),q.parts[j].options.map(o=>o.id).sort()));
    });orders.add(JSON.stringify(s.pinned));
  }
  assert.equal(seen.size,12);assert.ok(orders.size>1);
});

test('successive restarts use least-recently-seen alternatives, not only option shuffles',()=>{
  let s=start(10);const firstFour=new Set<string>();
  for(let i=0;i<8;i++){
    if(i<4)firstFour.add(s.pinned[0].id);
    const old=s,failed=answer(s,['p1']).state;
    s=accepted(engine.restart(failed,{runId:`retry-${i}`,seed:10,previousRunId:failed.runId,expectedRunRevision:failed.revision}));
    s.pinned.forEach((p,j)=>assert.notEqual(p.id,old.pinned[j].id));
  }
  assert.equal(firstFour.size,4);
});

test('content schema and cross-key validation reject malformed or expanded fixtures',()=>{
  for(const invalid of [
    {...raw,status:'APPROVED'}, {...raw,publicationEligible:true}, {...raw,bankRevision:2},
    {...raw,sourceCommit:'not-the-source'}, {...raw,records:raw.records.slice(1)},
    {...raw,records:[...raw.records,raw.records[0]]}, {...raw,unexpected:true},
  ])assert.throws(()=>adaptC0Fixture(invalid));
  for(const edit of [
    (b:typeof authoring)=>{b.records[0].parts[0].answerId='unknown';},
    (b:typeof authoring)=>{b.records[0].parts[0].options[1].id=b.records[0].parts[0].options[0].id;},
    (b:typeof authoring)=>{b.records[0].stimulus.vi='';},
    (b:typeof authoring)=>{b.records[0].parts[0].options[0].rationale.vi='';},
    (b:typeof authoring)=>{b.records[10].parts.pop();},
    (b:typeof authoring)=>{b.records[0].floor=2;},
    (b:typeof authoring)=>{b.records[0].parts[0].sourceRefs=[];},
    (b:typeof authoring)=>{b.records[1].id=b.records[0].id;},
  ]){const b=structuredClone(authoring);edit(b);assert.throws(()=>adaptC0Fixture(b));}
  const missing=adaptC0Fixture(raw);missing.answerKeys.questions[0].parts[0].feedback.pop();
  assert.throws(()=>createTowerEngine(missing.definition,missing.answerKeys));
  const version=adaptC0Fixture(raw);version.answerKeys.bankRevision=2;
  assert.throws(()=>createTowerEngine(version.definition,version.answerKeys),/version mismatch/);
  const underfill=adaptC0Fixture(raw);underfill.definition.questions.splice(4,1);underfill.answerKeys.questions.splice(4,1);
  assert.throws(()=>createTowerEngine(underfill.definition,underfill.answerKeys),/two meaningful/);
});

test('public projection has only current English question data and no private or future answers',()=>{
  function keys(v:unknown):string[]{return v&&typeof v==='object'?Object.entries(v).flatMap(([k,x])=>[k,...keys(x)]):[];}
  assert.ok(!keys(adapted.definition).some(k=>['answerId','rationale','feedback'].includes(k)));
  let s=start();
  for(let floor=1;floor<=5;floor++){
    const view=engine.present(s),names=keys(view);
    for(const k of ['answerId','acceptedChoiceId','correct','rationale','answerKeys','receipts','vi','sourceRefs','review','pinned'])assert.ok(!names.includes(k),k);
    assert.equal(view.question!.id,s.pinned[floor-1].id);assert.equal(view.question!.floor,floor);
    s.pinned.slice(floor).forEach(q=>assert.ok(!JSON.stringify(view).includes(q.id)));
    const q=structuredClone(view.question);view.question!.stimulus='presentation copy mutation';
    assert.deepEqual(engine.present(s).question,q);
    s=answer(s).state;
  }
});

test('no player/XP side effects and no runtime application import of DRAFT fixtures',()=>{
  const expedition=Object.freeze({xp:123,travel:Object.freeze({completed:['jp-arrival']}),checkpoint:'untouched'});
  const before=JSON.stringify(expedition);let s=start();for(let i=0;i<5;i++)s=answer(s).state;
  assert.equal(JSON.stringify(expedition),before);
  for(const name of ['xp','awardedXp','ledger','travel','checkpoint','stamp'])assert.ok(!(name in s));
  const engineSource=readFileSync(new URL('../packages/tower-engine/src/index.ts',import.meta.url),'utf8');
  assert.doesNotMatch(engineSource,/Math\.random|Date\.now|fetch\(|readFile|writeFile|process\.env|awardFirstClear/);
  function walk(dir:string){for(const e of readdirSync(dir,{withFileTypes:true})){
    const file=join(dir,e.name);if(e.isDirectory())walk(file);else if(/\.[cm]?[jt]sx?$/.test(e.name)){
      const source=readFileSync(file,'utf8');
      assert.doesNotMatch(source,/(?:from\s*|import\s*\()['"][^'"]*(?:c0-fixture-adapter|C0-question-bank)/,file);
      if(!file.replaceAll('\\','/').startsWith('lib/atlas/'))assert.doesNotMatch(source,/(?:from\s*|import\s*\()['"][^'"]*(?:tower-engine|content\/tower)/,file);
    }
  }}
  walk('app');walk('lib');walk('packages/mission-engine');walk('packages/domain');
  assert.deepEqual(C0FixtureSchema.parse(JSON.parse(readFileSync(new URL('../docs/game-01/c0/C0-question-bank-candidates.json',import.meta.url),'utf8'))),authoring);
});
