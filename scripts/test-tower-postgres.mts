import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {randomUUID,createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createLocalStack,ids} from './auth02/local-stack.mts';
import {adaptC0Fixture} from '../content/tower/c0-fixture-adapter.ts';
import {createIsolatedTowerRuntime,handleTower} from '../lib/atlas/tower-handlers.ts';
import {handleVercelAtlas} from '../lib/atlas/vercel-handler.ts';
import {supabaseExpeditionStore} from '../lib/atlas/supabase-storage.ts';
import {StorageUnavailable} from '../lib/atlas/storage.ts';
import type {Expedition} from '../lib/atlas/service.ts';
import type {TowerPresentation,Receipt} from '../content/tower/types.ts';

const bank=adaptC0Fixture(JSON.parse(await readFile('docs/game-01/c0/C0-question-bank-candidates.json','utf8')));
let runtime:ReturnType<typeof createIsolatedTowerRuntime>|undefined=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);
type Body={code?:string;isLanguageMistake?:boolean;replayed?:boolean;tower:{available:boolean;completed:boolean;bestClearedFloors:number;run:TowerPresentation};operation?:{runId:string;receipt?:Receipt;awardedXp:number}};
const stack=await createLocalStack(),store=supabaseExpeditionStore(stack.admin);
let mode:'normal'|'cas-once'|'cas-exhaust'|'storage'|'drop'='normal',casCalls=0;
const server=createServer(async(req,res)=>{
 try{
  const chunks:Buffer[]=[];for await(const c of req)chunks.push(Buffer.from(c));
  const origin=`http://${req.headers.host}`,headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v)headers.set(k,Array.isArray(v)?v.join(','):v);
  const request=new Request(origin+req.url,{method:req.method,headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});
  const token=headers.get('authorization')?.replace('Bearer ','')??'';
  const getUser=async()=>{const {data}=await stack.auth.auth.getUser(token);return data.user;};
  let response:Response;
  if(['cas-once','cas-exhaust','storage'].includes(mode)){
   const user=await getUser();assert.ok(user);
   response=await handleTower(request,{...store,compareAndSwap:async(...args)=>{
    casCalls++;if(mode==='storage')throw new StorageUnavailable('TEST_FAILURE');
    if(mode==='cas-exhaust'||casCalls===1)return false;return store.compareAndSwap(...args);
   }},user.id,runtime);
  }else response=await handleVercelAtlas(request,{getUser,getAdmin:()=>stack.admin,towerTestRuntime:runtime});
  if(mode==='drop'){mode='normal';res.destroy();return;}
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());
 }catch(e){res.writeHead(500);res.end(JSON.stringify({error:String(e)}));}
});
server.listen(0,'127.0.0.1');await once(server,'listening');const address=server.address();assert.ok(address&&typeof address!=='string');
const origin=`http://127.0.0.1:${address.port}`,alice=stack.token(ids.alice),bob=stack.token(ids.bob),failure=stack.token(ids.failure);
const row=async(id=ids.alice)=>{const r=(await stack.sql.query('select revision,document from atlas_expeditions where player_id=$1',[id])).rows[0];return {revision:Number(r.revision),document:JSON.parse(r.document) as Expedition};};
const checks:unknown[]=[];
function snapshot(r:Awaited<ReturnType<typeof row>>){return {revision:r.revision,xp:r.document.progress.xp,ledger:r.document.ledger,
 travel:r.document.travel,checkpoint:r.document.checkpoint,tower:r.document.tower,documentBytes:Buffer.byteLength(JSON.stringify(r.document)),
 sha256:createHash('sha256').update(JSON.stringify(r.document)).digest('hex')};}
async function oracle(name:string,before:Awaited<ReturnType<typeof row>>,action:string,expected:string,id=ids.alice){const observed=await row(id);checks.push({name,initial:snapshot(before),action,expected,observed:snapshot(observed),status:'PASS'});console.log(`PASS ${name}`);}
async function call(path:string,body?:unknown,token=alice){const r=await fetch(origin+'/api/'+path,{method:body===undefined?'GET':'POST',headers:{origin,authorization:`Bearer ${token}`,'content-type':'application/json','oai-authenticated-user-id':ids.bob},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json() as Body};}
async function ok(path:string,body?:unknown,token=alice){const r=await call(path,body,token);assert.ok(r.status<300,JSON.stringify(r));return r.body;}
const startInput=()=>({towerId:bank.definition.towerId,operationId:randomUUID(),acknowledgedRuleVersion:'c0-atomic-boss-v1'});
async function answerInput(token=alice,wrong:string[]=[]){const view=(await ok('tower/run',undefined,token)).tower.run,q=view.question!;
 const key=bank.answerKeys.questions.find(x=>x.id===q.id)!;
 return {runId:view.runId!,expectedRunRevision:view.revision!,questionId:q.id,questionRevision:q.revision,operationId:randomUUID(),confirmed:true,
  answers:q.parts.map(p=>({partId:p.id,choiceId:wrong.includes(p.id)?p.options.find(o=>o.id!==key.parts.find(k=>k.id===p.id)!.answerId)!.id:key.parts.find(k=>k.id===p.id)!.answerId}))};}
async function restart(token=alice){const r=(await ok('tower/run',undefined,token)).tower.run;return ok('tower/restart',{...startInput(),previousRunId:r.runId,expectedRunRevision:r.revision},token);}
async function reachBoss(token=alice){while((await ok('tower/run',undefined,token)).tower.run.clearedFloors!<4)await ok('tower/submit',await answerInput(token),token);}
try{
 await ok('session',{});await ok('session',{},bob);await ok('session',{},failure);
 let before=await row();assert.equal(before.document.tower,undefined);
 const unavailable=runtime;runtime=undefined;assert.equal((await ok('tower')).tower.available,false);assert.equal((await call('tower/start',startInput())).status,503);assert.deepEqual(await row(),before);runtime=unavailable;
 const startCmd=startInput(),started=await ok('tower/start',startCmd);assert.equal(started.tower.run.status,'IN_PROGRESS');assert.equal((await row()).document.tower!.activeRun!.pinned.length,5);
 assert.equal((await ok('tower/start',startCmd)).replayed,true);assert.equal((await row()).revision,before.revision+1);
 assert.doesNotMatch(JSON.stringify(started.tower.run),/answerId|acceptedChoiceId|manifestDigest|sourceRefs|bankId|seed/);
 await oracle('01 old document, disabled publication and start persistence',before,'GET empty; disabled POST; enable isolated fixture and start','Old document preserved; only test runtime can start; five pinned records');
 before=await row();runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);const resumed=await ok('tower/run');assert.deepEqual(resumed.tower.run,started.tower.run);assert.deepEqual(await row(),before);
 await oracle('02 discarded runtime resume',before,'Reconstruct evaluator; GET run','Same identity, pins, question/order; no write');
 let cmd=await answerInput();before=await row();await ok('tower/submit',cmd);assert.equal((await row()).document.tower!.activeRun!.clearedFloors,1);
 const duplicate=await ok('tower/submit',{...cmd,expectedRunRevision:999});assert.equal(duplicate.replayed,true);assert.equal((await row()).revision,before.revision+1);
 await oracle('03 correct answer and duplicate replay',before,'Confirm then retry same operation at stale revision','One revision, one floor, one scoring receipt');
 before=await row();for(const bad of [{...cmd,operationId:randomUUID()},{...cmd,answers:[{partId:'p1',choiceId:'c9'}]}, {...cmd,xp:40},{...cmd,confirmed:false}])assert.ok((await call('tower/submit',bad)).status>=400);
 const invalid=await answerInput();assert.equal((await call('tower/submit',{...invalid,answers:[{partId:'p1',choiceId:'unknown'}]})).status,400);
 assert.equal((await call('tower/start',{...startInput(),playerId:ids.bob})).status,400);assert.deepEqual(await row(),before);
 await oracle('04 stale, invalid, unconfirmed and spoofed requests',before,'Submit malformed/stale/changed payloads','No mutation or language failure');
 cmd=await answerInput(alice,['p1']);before=await row();await ok('tower/submit',cmd);assert.equal((await row()).document.tower!.activeRun!.status,'FAILED');assert.equal((await row()).document.tower!.mistakes.length,1);
 const failedRun=(await row()).document.tower!.activeRun!;await oracle('05 wrong confirmed answer',before,'Confirm wrong known choice','FAILED; one precise mistake; best retained');
 before=await row();const restartCmd={...startInput(),previousRunId:failedRun.runId,expectedRunRevision:failedRun.revision};await ok('tower/restart',restartCmd);assert.equal((await ok('tower/restart',restartCmd)).replayed,true);
 assert.notEqual((await row()).document.tower!.activeRun!.runId,failedRun.runId);assert.equal((await row()).revision,before.revision+1);
 assert.equal((await ok('tower/submit',cmd)).replayed,true);await oracle('06 restart and historical answer recovery',before,'Restart twice; recover old failed submission','Fresh run, Floor 1; old receipt replay cannot change it');
 before=await row();cmd=await answerInput();const batch=await Promise.all(Array.from({length:32},()=>call('tower/submit',cmd)));assert.ok(batch.every(x=>x.status<300));assert.equal(batch.filter(x=>!x.body.replayed).length,1);assert.equal((await row()).revision,before.revision+1);
 await oracle('07 32 concurrent duplicates',before,'32 HTTP requests with one operation identity','One CAS winner, one receipt, 31 replays');
 before=await row();cmd=await answerInput();const race=await Promise.all([call('tower/submit',cmd),call('tower/submit',{...cmd,operationId:randomUUID()})]);assert.deepEqual(race.map(r=>r.status).sort(),[201,409]);assert.equal((await row()).revision,before.revision+1);
 await oracle('08 competing operations',before,'Two operation IDs at same cursor','One winner, loser conflict; no lost update');
 before=await row();cmd=await answerInput();mode='cas-once';casCalls=0;await ok('tower/submit',cmd);assert.equal(casCalls,2);mode='normal';
 await oracle('09 CAS conflict reread',before,'Force one failed CAS then retry against real store','Two CAS attempts; one committed floor');
 before=await row();cmd=await answerInput();mode='cas-exhaust';casCalls=0;assert.equal((await call('tower/submit',cmd)).body.code,'CAS_RETRY_EXHAUSTED');assert.equal(casCalls,16);mode='storage';const unavailableResult=await call('tower/submit',cmd);assert.equal(unavailableResult.status,503);assert.equal(unavailableResult.body.tower.run.clearedFloors,before.document.tower!.activeRun!.clearedFloors);mode='normal';assert.deepEqual(await row(),before);
 await oracle('10 bounded retries and unavailable storage',before,'16 CAS failures, then injected storage exception','409/503, exact database state unchanged');
 before=await row();mode='drop';await assert.rejects(call('tower/submit',cmd));const recovered=await ok('tower/submit',cmd);assert.equal(recovered.replayed,true);assert.equal((await row()).revision,before.revision+1);
 await oracle('11 lost real HTTP response',before,'Commit then destroy HTTP socket; resend same operation','One advancement; original receipt recovered');
 before=await row();const foreign=await answerInput();assert.equal((await call('tower/submit',foreign,bob)).status,404);assert.equal((await call('tower?playerId='+ids.alice,undefined,bob)).status,400);assert.equal((await call('tower',undefined,'invalid')).status,401);assert.deepEqual(await row(),before);
 await oracle('12 account isolation',before,'Bob submits Alice run; spoof selector/header; invalid session','Owned 404/400/401, Alice unchanged');
 // We are now at the boss. Partial submission never consumes it.
 before=await row();cmd=await answerInput();assert.equal(cmd.answers.length,2);assert.equal((await call('tower/submit',{...cmd,answers:cmd.answers.slice(0,1)})).status,400);assert.deepEqual(await row(),before);
 for(const wrong of [['p1'],['p2'],['p1','p2']]){
  before=await row();await ok('tower/submit',await answerInput(alice,wrong));const r=(await row()).document.tower!.activeRun!;assert.equal(r.status,'FAILED');assert.equal(r.clearedFloors,4);assert.deepEqual(r.receipts.at(-1)!.parts.map(p=>p.correct),[!wrong.includes('p1'),!wrong.includes('p2')]);
  await oracle('13 boss '+wrong.join('+'),before,'Atomic two-part response','FAILED, four floors; honest per-part result');await restart();await reachBoss();
 }
 before=await row();const completedCmd=await answerInput();await ok('tower/submit',completedCmd);assert.equal((await row()).document.tower!.activeRun!.status,'COMPLETED');assert.equal((await row()).document.tower!.best,5);assert.equal((await row()).document.progress.xp,0);
 runtime=undefined;const historical=await ok('tower/submit',completedCmd);assert.equal(historical.replayed,true);assert.equal(historical.operation!.receipt!.outcome,'COMPLETED');runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);
 await oracle('14 boss full completion with rewards disabled',before,'Both correct','COMPLETED, best=5, no ledger/XP/stamp');
 // Bob exercises actual concurrent travel and Tower writes in the shared document.
 await ok('tower/start',startInput(),bob);before=await row(ids.bob);const bobCmd=await answerInput(bob);
 const travel={encounterId:'jp-arrival',version:1,stepId:'read-signs',band:'A2',support:{vietnamese:true,glossary:false},action:{kind:'inspect',target:'signs'}};
 await Promise.all([ok('tower/submit',bobCmd,bob),ok('travel/action',travel,bob)]);let b=await row(ids.bob);assert.equal(b.document.travel!.encounters['jp-arrival'].step,1);assert.equal(b.document.tower!.activeRun!.clearedFloors,1);
 await oracle('15 concurrent tower and travel',before,'Confirm Tower while inspecting airport sign','Both updates survive CAS; travel checkpoint remains valid',ids.bob);
 before=await row(ids.bob);await ok('tower/submit',await answerInput(bob,['p1']),bob);await restart(bob);b=await row(ids.bob);assert.deepEqual(b.document.travel,before.document.travel);assert.deepEqual(b.document.checkpoint,before.document.checkpoint);
 await oracle('16 World Travel isolation',before,'Fail/restart Tower with active travel checkpoint','Byte-equivalent travel/checkpoint; no progression loss',ids.bob);
 before=await row(ids.bob);await stack.sql.query('begin');await stack.sql.query('update atlas_expeditions set document=$1,revision=revision+1 where player_id=$2',[JSON.stringify({...before.document,tower:undefined}),ids.bob]);await stack.sql.query('rollback');assert.deepEqual(await row(ids.bob),before);
 await oracle('17 transaction rollback',before,'Update inside real SQL transaction then ROLLBACK','All Tower and travel state restored',ids.bob);
 // Trigger fault is scoped to this disposable database, never a repository migration.
 await stack.sql.query("create function public.tower_test_abort() returns trigger language plpgsql as $$ begin raise exception 'test abort'; end $$; create trigger tower_test_abort before update on atlas_expeditions for each row execute function public.tower_test_abort()");
 cmd=await answerInput(bob);assert.equal((await call('tower/submit',cmd,bob)).status,503);assert.deepEqual(await row(ids.bob),before);await stack.sql.query('drop trigger tower_test_abort on atlas_expeditions; drop function public.tower_test_abort()');
 await oracle('18 rejected database commit',before,'Inject local trigger abort during submit','503, no receipt, mistake, XP or floor write',ids.bob);
 before=await row(ids.bob);const changed=structuredClone(bank);changed.definition.bankRevision=2;changed.answerKeys.bankRevision=2;runtime=createIsolatedTowerRuntime(changed.definition,changed.answerKeys);
 assert.equal((await call('tower/submit',cmd,bob)).body.code,'CONTENT_MISMATCH');assert.deepEqual(await row(ids.bob),before);runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);
 await oracle('19 pinned manifest mismatch',before,'Load bank revision 2 for revision 1 active run','Recovery conflict, no reroll or language failure',ids.bob);
 runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys,{audience:'isolated-test',amount:7,policyIdentity:'first-clear-lifetime'});
 await ok('tower/start',startInput(),failure);await reachBoss(failure);before=await row(ids.failure);cmd=await answerInput(failure);
 const rewarded=await Promise.all(Array.from({length:32},()=>call('tower/submit',cmd,failure)));assert.ok(rewarded.every(r=>r.status<300));let f=await row(ids.failure);assert.equal(f.document.progress.xp,7);assert.equal(f.document.ledger.length,1);
 await oracle('20 test-only first-clear ledger concurrency',before,'32 final boss duplicates under isolated 7 XP fixture','One lifetime Tower ledger entry, total DB XP +7',ids.failure);
 // Test-only administrative reset of the challenge slot, preserving completion/ledger.
 const reset=structuredClone(f.document);delete reset.tower!.activeRun;await stack.sql.query('update atlas_expeditions set revision=revision+1,document=$1 where player_id=$2',[JSON.stringify(reset),ids.failure]);
 runtime=createIsolatedTowerRuntime(changed.definition,changed.answerKeys,{audience:'isolated-test',amount:9,policyIdentity:'first-clear-lifetime'});
 await ok('tower/start',startInput(),failure);await reachBoss(failure);before=await row(ids.failure);await ok('tower/submit',await answerInput(failure),failure);f=await row(ids.failure);assert.equal(f.document.progress.xp,7);assert.equal(f.document.ledger.length,1);
 await oracle('21 content/policy amount change cannot farm rewards',before,'Second full clear at bank 2 / test amount 9','Still one stable lifetime ledger entry, XP remains 7',ids.failure);
 runtime=createIsolatedTowerRuntime(bank.definition,bank.answerKeys);
 before=await row(ids.bob);await stack.sql.query('update atlas_expeditions set revision=revision+1,document=$1 where player_id=$2',[JSON.stringify({...before.document,testPadding:'x'.repeat(65536)}),ids.bob]);
 const full=await row(ids.bob);assert.equal((await call('tower/submit',await answerInput(bob),bob)).body.code,'RECOVERY_CAPACITY');assert.deepEqual(await row(ids.bob),full);
 await oracle('22 explicit capacity without receipt eviction',full,'Attempt scoring commit exceeding 64 KiB','503, no score/run consumption, all old receipts retained',ids.bob);
 await stack.sql.query('update atlas_expeditions set revision=revision+1,document=$1 where player_id=$2',[JSON.stringify(before.document),ids.bob]);
 const poisoned=await row(ids.bob);const corrupt=structuredClone(poisoned.document);corrupt.tower!.activeRun!.clearedFloors=5;
 await stack.sql.query('update atlas_expeditions set revision=revision+1,document=$1 where player_id=$2',[JSON.stringify(corrupt),ids.bob]);before=await row(ids.bob);assert.equal((await call('tower/run',undefined,bob)).body.code,'INVALID_TOWER_STATE');assert.deepEqual(await row(ids.bob),before);
 await oracle('23 malformed persisted state recovery',before,'Inconsistent authoritative snapshot fixture','503, no grading or further mutation',ids.bob);
 await mkdir('output/game-01/t2',{recursive:true});await writeFile('output/game-01/t2/postgres-oracles.json',JSON.stringify({info:stack.info,checks},null,2));
 console.log(`PASS ${checks.length} PostgreSQL Tower oracles; real HTTP/PostgREST/SQL, synthetic Auth, no Google OAuth`);
}finally{server.closeAllConnections();await new Promise<void>(r=>server.close(()=>r()));await stack.close();}
