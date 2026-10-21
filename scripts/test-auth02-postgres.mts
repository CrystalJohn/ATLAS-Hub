import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createLocalStack,ids} from './auth02/local-stack.mts';
import {handleVercelAtlas} from '../lib/atlas/vercel-handler.ts';
import {randomUUID} from 'node:crypto';
import type {AtlasState} from '../app/components/chapter-types.ts';
import type {PlayerProfile} from '../lib/atlas/profile.ts';
import type {ResumeState} from '../lib/atlas/checkpoint.ts';
import type {Expedition} from '../lib/atlas/service.ts';
import type {PlayerTravelProgress} from '../content/travel/types.ts';
type ApiBody=AtlasState&ResumeState&{travel:PlayerTravelProgress;profile:PlayerProfile;id:string;correct:boolean;awardedXp:number;code?:string;reward:{status:string}};

const started=Date.now(),checks:{scenario:string;status:string;details:unknown}[]=[];
const pass=(scenario:string,details:unknown)=>{checks.push({scenario,status:'PASS',details});console.log(`PASS ${scenario}`);};
const stack=await createLocalStack();
let aliceToken=stack.token(ids.alice);const bobToken=stack.token(ids.bob);
async function call(path:string,body?:unknown,token=aliceToken,admin=stack.admin,origin='https://atlas.test'){
 const response=await handleVercelAtlas(new Request(`https://atlas.test/api/${path}`,{method:body===undefined?'GET':'POST',headers:{origin,'Content-Type':'application/json','oai-authenticated-user-id':ids.bob},...(body===undefined?{}:{body:JSON.stringify(body)})}),{
  getAdmin:()=>admin,getUser:async()=>{const {data}=await stack.auth.auth.getUser(token);return data.user;},
 });
 assert.ok(response.headers.get('cache-control')?.includes('no-store'));
 return {status:response.status,body:await response.json() as ApiBody};
}
const row=async(id:string)=>{const r=(await stack.sql.query('select revision,document from public.atlas_expeditions where player_id=$1',[id])).rows[0];assert.ok(r);return {document:String(r.document),revision:Number(r.revision)};};
const state=async(token=aliceToken)=>(await call('state',undefined,token)).body;
const payload=(id:string,stepId:string,action:unknown,extra={})=>({encounterId:id,version:1,stepId,band:'A2',support:{vietnamese:true,glossary:false},action,...extra});
async function ok(path:string,body?:unknown,token=aliceToken){const r=await call(path,body,token);assert.ok(r.status<300,`${path}: ${JSON.stringify(r)}`);return r.body;}
async function prepareForest(token=aliceToken){const a=await ok('attempts',{missionId:'silent-forest'},token);for(const clueId of ['canopy','stream','wildlife'])await ok(`attempts/${a.id}/observe`,{clueId},token);return a;}
try{
 assert.deepEqual(await row(ids.legacy),stack.legacyBefore);
 pass('Migration preserves pre-existing expedition bytes/revision',{revision:5});
 assert.equal((await call('session',{},'invalid')).status,401);
 assert.equal((await call('session',{},stack.token(ids.alice,-30))).status,401);
 assert.equal((await stack.sql.query('select count(*)::int as n from public.atlas_profiles where player_id=$1',[ids.alice])).rows[0].n,0);
 assert.equal((await call('session',{},aliceToken,stack.admin,'https://evil.test')).status,403);
 pass('Invalid/expired/CSRF sessions reject without player writes',{});

 const initialized=await Promise.all(Array.from({length:24},()=>call('session',{})));
 assert.ok(initialized.every(r=>r.status===200),JSON.stringify(initialized.filter(r=>r.status!==200)));
 assert.equal((await stack.sql.query('select count(*)::int as n from public.atlas_profiles where player_id=$1',[ids.alice])).rows[0].n,1);
 assert.equal((await stack.sql.query('select count(*)::int as n from public.atlas_expeditions where player_id=$1',[ids.alice])).rows[0].n,1);
 await ok('profile',{displayName:'AUTH02 Alice',readingBand:'B1',interests:['food','nature']});
 await ok('session',{});const profile=(await ok('profile')).profile;
 assert.equal(profile.displayName,'AUTH02 Alice');assert.equal(profile.readingBand,'B1');assert.deepEqual(profile.interests,['nature','food']);
 pass('Concurrent identity initialization and returning profile',{requests:24,profiles:1,expeditions:1,existingMetadataPreserved:true});

 await ok('session',{},bobToken);
 const a=await prepareForest();
 const checkpoint=await ok('resume');assert.ok(checkpoint.target?.kind==='nature');assert.equal(checkpoint.target.attemptId,a.id);assert.equal(checkpoint.target.phase,'explore');
 const beforeAttack=await row(ids.alice);
 assert.equal((await call(`attempts/${a.id}/submit`,{type:'DISCOVERY',answer:'linked'},bobToken)).status,404);
 assert.equal((await call(`attempts/${a.id}/observe`,{clueId:'canopy'},bobToken)).status,404);
 assert.equal((await call('checkpoint',{expectedRevision:(await state(bobToken)).revision,target:{kind:'nature',attemptId:a.id,phase:'brief'}},bobToken)).status,400);
 assert.equal((await call(`resume?playerId=${ids.alice}`,undefined,bobToken)).status,400);
 assert.equal((await call('profile',{playerId:ids.alice,displayName:'Hijack'},bobToken)).status,400);
 assert.equal((await call(`attempts/${a.id}/submit`,{type:'DISCOVERY',answer:'linked',xp:999999})).status,400);
 assert.deepEqual(await row(ids.alice),beforeAttack);
 assert.equal((await ok('resume',undefined,bobToken)).target,null);
 assert.equal((await state(bobToken)).xp,0);
 pass('API account isolation and reward/identity injection',{foreignAttempts:404,foreignCheckpoint:400,selectors:400,otherPlayerUnchanged:true});
 const bobUnobserved=await ok('attempts',{missionId:'silent-forest'},bobToken),bobRevision=(await state(bobToken)).revision;
 assert.equal((await call('checkpoint',{expectedRevision:bobRevision,target:{kind:'nature',attemptId:bobUnobserved.id,phase:'english'}},bobToken)).status,400);
 assert.equal((await call('checkpoint',{expectedRevision:bobRevision,target:{kind:'travel',encounterId:'jp-food'}},bobToken)).status,403);
 pass('Checkpoint references and prerequisites',{unobservedEnglishPhase:400,lockedTravelStop:403});

 const count=32;
 const clears=await Promise.all(Array.from({length:count},()=>call(`attempts/${a.id}/submit`,{type:'DISCOVERY',answer:'linked'})));
 assert.ok(clears.every(r=>r.status<300),JSON.stringify(clears.filter(r=>r.status>=300)));
 assert.equal(clears.reduce((sum,r)=>sum+r.body.awardedXp,0),30);
 assert.equal(clears.filter(r=>r.body.reward.status==='AWARDED').length,1);
 assert.ok(clears.filter(r=>r.body.reward.status==='ALREADY_PROCESSED').length===count-1);
 assert.equal((await state()).xp,30);assert.equal((await state()).ledger.length,1);
 const cleared=await ok('resume');assert.equal(cleared.target,null);assert.equal(cleared.reason,'NONE');assert.equal(cleared.recovered,false);
 pass('Real PostgreSQL concurrent Forest first-clear',{requests:count,totalAwardedXp:30,ledgerEntries:1,alreadyProcessed:count-1});

 assert.equal((await call('travel/action',payload('jp-food','read-menu',{kind:'inspect',target:'menu'}))).status,403);
 await ok('travel/start',{countryId:'JP'});
 let current=await state();
 await ok('checkpoint',{expectedRevision:current.revision,target:{kind:'travel',encounterId:'jp-arrival'}});
 const oldRevision=current.revision;
 assert.equal((await call('checkpoint',{expectedRevision:oldRevision,target:{kind:'travel',encounterId:'jp-arrival'}})).body.code,'STALE_REVISION');
 await ok('travel/action',payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}));
 const travelCheckpoint=await ok('resume');assert.ok(travelCheckpoint.target?.kind==='travel');assert.equal(travelCheckpoint.target.stepId,'ask-staff');assert.equal(travelCheckpoint.target.step,1);
 // Logout invalidates this fixture session; re-login issues a new verified token.
 await fetch(`${stack.url}/auth/v1/logout`,{method:'POST',headers:{authorization:`Bearer ${aliceToken}`}});
 assert.equal((await call('state')).status,401);
 aliceToken=stack.token(ids.alice);await ok('session',{});
 assert.deepEqual(await ok('resume'),travelCheckpoint);
 assert.equal((await state()).xp,30);assert.equal((await ok('profile')).profile.displayName,'AUTH02 Alice');
 pass('Durable checkpoint, reload/re-login and stale revision',{step:1,stepId:'ask-staff',sameProfile:true,staleUpdate:409});

 await ok('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));
 const finish=payload('jp-arrival','find-train',{kind:'target',target:'station'});
 const travelClears=await Promise.all(Array.from({length:32},()=>call('travel/action',finish)));
 assert.ok(travelClears.every(r=>r.status<300));assert.equal(travelClears.reduce((sum,r)=>sum+r.body.awardedXp,0),30);
 assert.equal((await state()).travel.stamps.length,1);
 assert.equal((await state(bobToken)).travel.stamps.length,0);
 pass('Real PostgreSQL concurrent Tokyo first-clear',{requests:32,totalAwardedXp:30,stampCount:1});

 const plans=[
 ['jp-directions',[['read-map',{kind:'inspect',target:'map'}],['ask-route',{kind:'say',choice:'bookshop'}],['walk-route',{kind:'move',direction:'up',expectedMove:0}],['walk-route',{kind:'move',direction:'right',expectedMove:1}],['walk-route',{kind:'move',direction:'up',expectedMove:2}]]],
 ['jp-food',[['read-menu',{kind:'inspect',target:'menu'}],['ask-ingredients',{kind:'say',choice:'ingredients'}],['inspect-ingredients',{kind:'inspect',target:'ingredients'}],['place-order',{kind:'order',dish:'vegetable',preference:'no-egg'}]]],
 ['jp-culture',[['look-gate',{kind:'inspect',target:'gate'}],['look-shops',{kind:'inspect',target:'shops'}],['ask-guide',{kind:'say',choice:'about'}],['share-visit',{kind:'compose',tiles:['i','enjoyed','gate','and','shops']}]]],
 ] as const;
 for(const [id,steps]of plans)for(const [step,action]of steps)assert.equal((await ok('travel/action',payload(id,step,action))).correct,true);
 current=await state();assert.equal(current.xp,190);assert.equal(current.level,2);assert.equal(current.travel!.stamps.length,5);assert.equal(current.englishEvidence.filter(e=>e.missionId.startsWith('travel:')).length,8);
 const staleRestart=payload('jp-arrival','',{kind:'restart'},{expectedRevision:0});
 assert.equal((await call('travel/action',staleRestart)).body.code,'STALE_REVISION');
 await ok('travel/action',payload('jp-arrival','',{kind:'restart'},{expectedRevision:current.revision}));
 await ok('travel/action',payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}));
 await ok('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));
 assert.equal((await ok('travel/action',finish)).awardedXp,0);
 assert.equal((await state()).xp,190);assert.equal((await state()).travel.stamps.length,5);
 const lake=await ok('attempts',{missionId:'disappearing-lake'});for(const clueId of ['temperature','oxygen','screen'])await ok(`attempts/${lake.id}/observe`,{clueId});
 await ok(`attempts/${lake.id}/submit`,{type:'REASONING',answer:'oxygen-stress',evidence:['oxygen-response','warm-reference']});
 const grove=await ok('attempts',{missionId:'restore-ecosystem'});
 await ok(`attempts/${grove.id}/submit`,{type:'PUZZLE',sequence:['aerate','shade','monitor','restock'],transfer:'reassess'});
 current=await state();assert.equal(current.xp,370);assert.equal(current.level,3);assert.equal(current.ledger.length,7);assert.equal(current.completed.length,3);
 pass('Full Tokyo pilot and Forest regression',{tokyoXp:160,forestXp:210,totalXp:370,level:3,stamps:5,ledgerEntries:7,replayAward:0});
 const beforeProfileEdit=await row(ids.alice);
 await ok('profile',{displayName:'AUTH02 Alice renamed',readingBand:'B2',vietnameseSupport:false,interests:['culture']});
 await Promise.all(Array.from({length:12},()=>ok('session',{})));
 assert.deepEqual(await row(ids.alice),beforeProfileEdit);
 const returningProfile=(await ok('profile')).profile;assert.equal(returningProfile.displayName,'AUTH02 Alice renamed');assert.deepEqual(returningProfile.interests,['culture']);
 pass('Profile edits and concurrent returning logins preserve progression',{requests:12,xp:370,documentAndRevision:'unchanged',nameAndPreferences:'preserved'});

 // A deferred PostgreSQL trigger fails at COMMIT after the UPDATE has executed.
 const failureToken=stack.token(ids.failure);await ok('session',{},failureToken);
 await ok('travel/action',payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}),failureToken);
 await ok('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}),failureToken);
 await stack.sql.query(`create function public.auth02_fail_commit() returns trigger language plpgsql as $$begin
  if new.player_id='${ids.failure}' and jsonb_array_length(new.document::jsonb->'ledger')>0 then raise exception 'Injected test commit failure'; end if;return new;end;$$;
  create constraint trigger auth02_commit_failure after update on public.atlas_expeditions deferrable initially deferred for each row execute function public.auth02_fail_commit();`);
 const beforeFailure=await row(ids.failure);
 assert.equal((await call('travel/action',finish,failureToken)).status,503);
 assert.deepEqual(await row(ids.failure),beforeFailure);
 await stack.sql.query('drop trigger auth02_commit_failure on public.atlas_expeditions;drop function public.auth02_fail_commit();');
 assert.equal((await ok('travel/action',finish,failureToken)).awardedXp,30);
 assert.equal((await ok('travel/action',finish,failureToken)).awardedXp,0);
 pass('Commit-time transaction failure is atomic and retry-safe',{failedResponse:503,unchangedRevisionAndDocument:true,retryXp:30,repeatXp:0});

 // Simulate a committed reward whose HTTP response is lost in transit.
 const bobAttempt=await prepareForest(bobToken);let lost=false;
 const lossy=createClient(stack.url,stack.serviceKey,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:async(input,init)=>{
  const request=new Request(input,init),response=await fetch(request);
  if(!lost&&request.method==='PATCH'&&response.ok){lost=true;await response.arrayBuffer();throw new TypeError('Injected lost response after commit');}
  return response;
 }}});
 const lostResponse=await call(`attempts/${bobAttempt.id}/submit`,{type:'DISCOVERY',answer:'linked'},bobToken,lossy);assert.equal(lost,true);
 const retried=await ok(`attempts/${bobAttempt.id}/submit`,{type:'DISCOVERY',answer:'linked'},bobToken);
 assert.equal(retried.awardedXp,0);assert.equal(retried.reward.status,'ALREADY_PROCESSED');
 assert.equal((await state(bobToken)).xp,30);assert.equal((await state(bobToken)).ledger.length,1);
 pass('Lost-response retry keeps one authoritative reward',{injectedLossResponse:lostResponse.status,xp:30,ledgerEntries:1,duplicateStatus:retried.reward.status});

 const pendingLake=await ok('attempts',{missionId:'disappearing-lake'},bobToken);
 await ok('travel/action',payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}),bobToken);
 const checkpointRevision=(await state(bobToken)).revision;
 const checkpointRace=await Promise.all([
  call('checkpoint',{expectedRevision:checkpointRevision,target:{kind:'nature',attemptId:pendingLake.id,phase:'brief'}},bobToken),
  call('checkpoint',{expectedRevision:checkpointRevision,target:{kind:'travel',encounterId:'jp-arrival'}},bobToken),
 ]);
 assert.deepEqual(checkpointRace.map(r=>r.status).sort(),[201,409]);
 await ok('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}),bobToken);
 await ok('travel/action',finish,bobToken);
 const nextUnfinished=await ok('resume',undefined,bobToken);
 assert.ok(nextUnfinished.target?.kind==='nature');assert.equal(nextUnfinished.target.attemptId,pendingLake.id);
 await ok('travel/action',finish,bobToken);
 assert.deepEqual(await ok('resume',undefined,bobToken),nextUnfinished,'Delayed duplicate completion cannot replace a newer checkpoint');
 pass('Checkpoint concurrency and latest unfinished adventure',{concurrentSelection:'one commit, one 409',completedAdventure:'falls back to newest unfinished by server revision',delayedDuplicate:'does not overwrite checkpoint'});

 const snapshot=await row(ids.alice),document:Expedition=JSON.parse(snapshot.document);
 const invalids=[
  {...document,progress:{...document.progress,xp:document.progress.xp+99}},
  {...document,ledger:[...document.ledger,{...document.ledger[0],id:randomUUID()}]},
  {...document,ledger:document.ledger.slice(1)},
  {...document,progress:{...document.progress,completed:[]}},
  {...document,travel:{...document.travel,stamps:[]}},
 ];
 for(const candidate of invalids){const r=await stack.admin.from('atlas_expeditions').update({document:JSON.stringify(candidate),revision:snapshot.revision+1}).eq('player_id',ids.alice).eq('revision',snapshot.revision);assert.equal(r.error?.code,'23514',JSON.stringify(r.error));assert.deepEqual(await row(ids.alice),snapshot);}
 const badRevision=await stack.admin.from('atlas_expeditions').update({document:snapshot.document,revision:snapshot.revision+4}).eq('player_id',ids.alice);assert.equal(badRevision.error?.code,'23514');
 const badOwner=await stack.admin.from('atlas_expeditions').update({player_id:randomUUID(),revision:snapshot.revision+1}).eq('player_id',ids.alice);assert.equal(badOwner.error?.code,'23514');
 const badFk=await stack.admin.from('atlas_profiles').insert({player_id:randomUUID()});assert.equal(badFk.error?.code,'23503');
 const genesisId=randomUUID();await stack.sql.query('insert into auth.users(id) values ($1)',[genesisId]);
 const prefunded=await stack.admin.from('atlas_expeditions').insert({player_id:genesisId,revision:0,document:JSON.stringify(document)});assert.equal(prefunded.error?.code,'23514');
 assert.equal((await stack.sql.query('select count(*)::int as n from public.atlas_expeditions where player_id=$1',[genesisId])).rows[0].n,0);
 pass('PostgreSQL reward/revision/ownership/FK constraints',{rejected:'XP without ledger; duplicate ledger key; ledger edit/removal; completion/stamp removal; revision jump; owner change; orphan profile'});

 for(const role of ['anon','authenticated']){
  const bearer=role==='anon'?stack.publicKey:aliceToken;
  const r=await fetch(`${stack.url}/rest/v1/atlas_expeditions?player_id=eq.${ids.bob}`,{headers:{apikey:stack.publicKey,authorization:`Bearer ${bearer}`}});assert.ok([401,403].includes(r.status));
  const patch=await fetch(`${stack.url}/rest/v1/atlas_expeditions?player_id=eq.${ids.alice}`,{method:'PATCH',headers:{apikey:stack.publicKey,authorization:`Bearer ${bearer}`,'Content-Type':'application/json'},body:JSON.stringify({revision:999})});assert.ok([401,403].includes(patch.status));
  const p=await fetch(`${stack.url}/rest/v1/atlas_profiles`,{headers:{apikey:stack.publicKey,authorization:`Bearer ${bearer}`}});assert.ok([401,403].includes(p.status));
 }
 // Verify RLS independently from table grants on this disposable database.
 await stack.sql.query('grant select on public.atlas_profiles,public.atlas_expeditions to authenticated;set role authenticated;');
 try{assert.equal((await stack.sql.query('select * from public.atlas_profiles')).rowCount,0);assert.equal((await stack.sql.query('select * from public.atlas_expeditions')).rowCount,0);}finally{await stack.sql.query('reset role;revoke select on public.atlas_profiles,public.atlas_expeditions from authenticated;');}
 assert.deepEqual(await row(ids.alice),snapshot);
 pass('Real PostgREST grants and PostgreSQL RLS',{anonAndAuthenticatedReadsAndWrites:'denied',rlsWithTemporarySelectGrant:'zero rows',serviceBoundary:'server verified UUID only'});

 const legacyToken=stack.token(ids.legacy),legacyResume=await ok('resume',undefined,legacyToken);
 assert.ok(legacyResume.target?.kind==='travel');assert.equal(legacyResume.target.step,1);assert.equal(legacyResume.reason,'LEGACY_RECOVERED');
 let legacyRow=await row(ids.legacy),legacyDoc=JSON.parse(legacyRow.document);
 const deletedCheckpoint={schemaVersion:1,savedRevision:legacyRow.revision+1,updatedAt:new Date().toISOString(),contentVersion:1,target:{kind:'travel',encounterId:'deleted-stop'}};
 const invalidCheckpointWrite=await stack.admin.from('atlas_expeditions').update({revision:legacyRow.revision+1,document:JSON.stringify({...legacyDoc,checkpoint:deletedCheckpoint})}).eq('player_id',ids.legacy);assert.equal(invalidCheckpointWrite.error,null);
 assert.equal((await ok('resume',undefined,legacyToken)).reason,'INVALID_CHECKPOINT');assert.equal((await state(legacyToken)).xp,30);
 legacyRow=await row(ids.legacy);legacyDoc=JSON.parse(legacyRow.document);
 const foreignCheckpoint={schemaVersion:1,savedRevision:legacyRow.revision+1,updatedAt:new Date().toISOString(),contentVersion:1,target:{kind:'nature',attemptId:a.id,phase:'brief'}};
 const foreignCheckpointWrite=await stack.admin.from('atlas_expeditions').update({revision:legacyRow.revision+1,document:JSON.stringify({...legacyDoc,checkpoint:foreignCheckpoint})}).eq('player_id',ids.legacy);assert.equal(foreignCheckpointWrite.error,null);
 const foreignRead=await ok('resume',undefined,legacyToken);assert.ok(foreignRead.target?.kind==='travel');assert.equal(foreignRead.reason,'INVALID_CHECKPOINT');
 legacyRow=await row(ids.legacy);legacyDoc=JSON.parse(legacyRow.document);
 const changedContent={schemaVersion:1,savedRevision:legacyRow.revision+1,updatedAt:new Date().toISOString(),contentVersion:999,target:{kind:'travel',encounterId:'jp-arrival'}};
 const changedCheckpointWrite=await stack.admin.from('atlas_expeditions').update({revision:legacyRow.revision+1,document:JSON.stringify({...legacyDoc,checkpoint:changedContent})}).eq('player_id',ids.legacy);assert.equal(changedCheckpointWrite.error,null);
 const changedResume=await ok('resume',undefined,legacyToken);assert.equal(changedResume.reason,'CONTENT_CHANGED');assert.equal(changedResume.target,null);
 assert.equal((await state(legacyToken)).completed[0],'silent-forest');
 pass('Legacy/invalid/deleted/versioned checkpoint recovery',{legacyStep:1,invalid:'safe owned fallback',contentChanged:'no auto-resume, progress preserved'});

 const finalRow=await row(ids.alice),finalDoc:Expedition=JSON.parse(finalRow.document);
 assert.equal(finalDoc.progress.xp,370);assert.equal(finalDoc.ledger.length,7);assert.equal(finalDoc.travel!.stamps.length,5);
 assert.equal(finalDoc.progress.xp,finalDoc.ledger.reduce((sum,e)=>sum+e.amount,0));
 pass('Authoritative database oracle matches API',{xp:370,ledger:7,stamps:5,completedMissions:3});

 const allBeforeRecovery=(await stack.sql.query('select player_id,revision,document from public.atlas_expeditions order by player_id')).rows;
 const migration=await readFile('supabase/migrations/20261021090000_auth02_expedition_integrity.sql','utf8');
 await stack.sql.query(await readFile('supabase/rollback/20261021090000_auth02_expedition_integrity.sql','utf8'));
 assert.deepEqual((await stack.sql.query('select player_id,revision,document from public.atlas_expeditions order by player_id')).rows,allBeforeRecovery);
 const recoveryRow=await row(ids.legacy),recoveryDoc:Expedition=JSON.parse(recoveryRow.document);
 const corrupt={...recoveryDoc,ledger:[...recoveryDoc.ledger,{...recoveryDoc.ledger[0],id:randomUUID()}]};
 await stack.sql.query('update public.atlas_expeditions set document=$1 where player_id=$2',[JSON.stringify(corrupt),ids.legacy]);
 const incompatible=await row(ids.legacy);
 await assert.rejects(stack.sql.query(migration),error=>(error as {code:string}).code==='23514');
 await stack.sql.query('rollback');
 assert.deepEqual(await row(ids.legacy),incompatible,'Incompatible migration must not rewrite historic data');
 await stack.sql.query('update public.atlas_expeditions set document=$1 where player_id=$2',[recoveryRow.document,ids.legacy]);
 await stack.sql.query(migration);
 assert.deepEqual((await stack.sql.query('select player_id,revision,document from public.atlas_expeditions order by player_id')).rows,allBeforeRecovery);
 pass('Migration preflight abort and explicit recovery preserve data',{incompatibleLedger:'migration transaction rejected, row unchanged',rollback:'no row loss',reapply:'PASS'});
 await mkdir('output/auth02',{recursive:true});
 await writeFile('output/auth02/postgres-evidence.json',JSON.stringify({classification:'PROVISIONAL',...stack.info,elapsedMs:Date.now()-started,checks,limitations:['Synthetic Auth verifier/users, not Google OAuth or GoTrue','Local PostgreSQL/PostgREST, not a hosted Supabase staging project','No production writes or destructive tests']},null,2));
 console.log(`PASS AUTH-02: ${checks.length} scenarios on native PostgreSQL + PostgREST. Google OAuth E2E NOT RUN.`);
}finally{await stack.close();}
