import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {createTowerEngine} from '../../packages/tower-engine/src/index.ts';
import {IdSchema,RevisionSchema,type TowerDefinition,type TowerAnswerKeys,type TowerRun,type TowerState,type TransitionResult} from '../../content/tower/types.ts';
import {StorageUnavailable,type ExpeditionStore} from './storage.ts';
import type {Expedition} from './service.ts';
import {emptyProgress} from '../../packages/domain/src/index.ts';
import {TowerNamespaceSchema,emptyTower,persistedRun,type TowerNamespace} from './tower-state.ts';
import {awardFirstClear} from './rewards.ts';

// The real route supplies no runtime until content publication is approved.
// Only isolated test harnesses construct/inject the DRAFT runtime; no env flag loads drafts.
export type TowerRuntime={definition:TowerDefinition;engine:ReturnType<typeof createTowerEngine>;
 testReward?:{audience:'isolated-test';amount:number;policyIdentity:'first-clear-lifetime'}};
export function createIsolatedTowerRuntime(definition:TowerDefinition,keys:TowerAnswerKeys,testReward?:TowerRuntime['testReward']):TowerRuntime{
 if(testReward&&(!Number.isSafeInteger(testReward.amount)||testReward.amount<=0))throw new Error('Invalid test reward');
 return {definition:structuredClone(definition),engine:createTowerEngine(definition,keys),testReward};
}
const rule=z.literal('c0-atomic-boss-v1');
const Start=z.object({operationId:IdSchema,towerId:z.literal('tower:narita-airport-survival'),acknowledgedRuleVersion:rule}).strict();
const Restart=Start.extend({previousRunId:IdSchema,expectedRunRevision:RevisionSchema}).strict();
const Submit=z.object({operationId:IdSchema,runId:IdSchema,expectedRunRevision:RevisionSchema,questionId:IdSchema,
 questionRevision:z.number().int().positive(),confirmed:z.literal(true),answers:z.array(z.object({partId:IdSchema,choiceId:IdSchema}).strict()).min(1).max(2)}).strict();
class TowerError extends Error{readonly status:number;readonly code:string;constructor(status:number,code:string,message:string){super(message);this.status=status;this.code=code;}}
const canonical=(v:unknown):string=>Array.isArray(v)?`[${v.map(canonical).join(',')}]`:v!==null&&typeof v==='object'?
 `{${Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>`${JSON.stringify(k)}:${canonical(x)}`).join(',')}}`:JSON.stringify(v);
const hash=(v:unknown)=>createHash('sha256').update(canonical(v)).digest('hex');
const fresh=():Expedition=>({progress:emptyProgress(),attempts:[],ledger:[],submissions:[]});
const unwrap=(r:TransitionResult):TowerRun=>{
 if(!r.ok)throw new TowerError(r.error.code==='WRONG_RUN'?404:['INVALID_REQUEST','INVALID_CHOICE','INCOMPLETE_SELECTION','SELECTION_MISMATCH'].includes(r.error.code)?400:409,r.error.code,r.error.message);
 if(r.state.status==='NOT_STARTED')throw new TowerError(503,'INVALID_TOWER_STATE','Missing run');
 return r.state;
};
function summary(s:TowerNamespace,runtime?:TowerRuntime){
 let run:unknown={status:'NOT_STARTED'};
 if(s.activeRun){
  if(!runtime)run={status:s.activeRun.status,runId:s.activeRun.runId,revision:s.activeRun.revision,contentUnavailable:true};
  else{try{run=runtime.engine.present(s.activeRun);}catch{run={status:s.activeRun.status,runId:s.activeRun.runId,revision:s.activeRun.revision,contentUnavailable:true};}}
 }
 return {available:!!runtime,contentStatus:runtime?'DRAFT_TEST_ONLY':'UNPUBLISHED',towerId:'tower:narita-airport-survival',
  bestClearedFloors:s.best,completed:s.completed,firstClearEligible:!s.completed,rewardPolicy:'DISABLED',run,
  ...(s.activeRun?.receipts.at(-1)?{lastOutcome:s.activeRun.receipts.at(-1)}:{})};
}
export async function handleTower(request:Request,store:ExpeditionStore,player:string,runtime?:TowerRuntime):Promise<Response>{
 let latest:TowerNamespace|undefined;
 const reply=(v:object,status=200)=>Response.json(v,{status});
 try{
  const url=new URL(request.url),action=url.pathname.slice('/api/tower'.length);
  if(url.search)throw new TowerError(400,'INVALID_REQUEST','Tower query parameters are not supported.');
  const reading=request.method==='GET'&&['','/run'].includes(action);
  if(!reading&&!(request.method==='POST'&&['/start','/restart','/submit'].includes(action)))throw new TowerError(404,'NOT_FOUND','Unknown Tower operation.');
  let input:z.infer<typeof Start>|z.infer<typeof Restart>|z.infer<typeof Submit>|undefined;
  if(!reading){const raw=await request.text();if(raw.length>16000)throw new TowerError(413,'INVALID_REQUEST','Request too large.');
   let body:unknown;try{body=JSON.parse(raw);}catch{throw new TowerError(400,'INVALID_REQUEST','Invalid JSON.');}
   input=(action==='/start'?Start:action==='/restart'?Restart:Submit).parse(body);
  }
  // Randomness/identity are server-owned and stable across retries of this request.
  const runId=randomUUID(),seed=randomBytes(4).readUInt32LE();
  const semantic=input&&'answers' in input?{...input,expectedRunRevision:undefined,answers:[...input.answers].sort((a,b)=>a.partId.localeCompare(b.partId))}:
   input&&'previousRunId' in input?{...input,expectedRunRevision:undefined}:input;
  const fingerprint=hash({action,semantic});
  await store.initialize(player,JSON.stringify(fresh()));
  for(let retry=0;retry<16;retry++){
   const row=await store.read(player);if(!row)throw new StorageUnavailable('MISSING_EXPEDITION');
   const d:Expedition=JSON.parse(row.document);
   let s:TowerNamespace;try{s=d.tower===undefined?emptyTower():TowerNamespaceSchema.parse(d.tower);}catch{throw new TowerError(503,'INVALID_TOWER_STATE','Stored Tower state needs recovery.');}
   latest=structuredClone(s);
   if(reading)return reply({tower:summary(s,runtime),expeditionRevision:row.revision});
   const cmd=input!;
   const old=s.operations.find(o=>o.id===cmd.operationId);
   if(old){if(old.fingerprint!==fingerprint)throw new TowerError(409,'OPERATION_CONFLICT','Operation identity has a different payload.');
    return reply({tower:summary(s,runtime),expeditionRevision:row.revision,replayed:true,operation:old});}
   if(!runtime)throw new TowerError(503,'CONTENT_UNAVAILABLE','No reviewed Tower content is published.');
   if(s.operations.length>=1000)throw new TowerError(503,'RECOVERY_CAPACITY','Tower receipt retention needs maintenance; no run was consumed.');
   let next:TowerRun;
   if(action==='/start')next=unwrap(runtime.engine.start(s.activeRun??runtime.engine.initialState(),{runId,seed}));
   else if(action==='/restart'){
    const c=cmd as z.infer<typeof Restart>;
    if(!s.activeRun||s.activeRun.runId!==c.previousRunId)throw new TowerError(404,'RUN_NOT_FOUND','Run not found.');
    next=unwrap(runtime.engine.restart(s.activeRun,{runId,seed,previousRunId:c.previousRunId,expectedRunRevision:c.expectedRunRevision}));
   }else{
    const c=cmd as z.infer<typeof Submit>;
    if(!s.activeRun||s.activeRun.runId!==c.runId)throw new TowerError(404,'RUN_NOT_FOUND','Run not found.');
    // Selection is an ephemeral reviewed draft. No selection writes or grading before confirmation.
    let selected:TowerState=s.activeRun;
    for(const a of c.answers)selected=unwrap(runtime.engine.select(selected,{runId:c.runId,expectedRunRevision:c.expectedRunRevision,questionId:c.questionId,questionRevision:c.questionRevision,...a}));
    next=unwrap(runtime.engine.submit(selected,c));
   }
   s.activeRun=persistedRun(next);s.best=Math.max(s.best,next.clearedFloors);s.completed||=next.status==='COMPLETED';
   const receipt=action==='/submit'?s.activeRun.receipts.at(-1):undefined;
   if(receipt){const q=runtime.definition.questions.find(q=>q.id===receipt.questionId)!;
    for(const p of receipt.parts.filter(p=>!p.correct)){const part=q.parts.find(x=>x.id===p.partId)!;
     s.mistakes.push({runId:next.runId,questionId:q.id,questionRevision:q.revision,partId:p.partId,choiceId:p.choiceId,
      sourceRefs:part.sourceRefs,objectiveIds:part.objectiveIds,remediationId:part.remediationId});}
    s.mistakes=s.mistakes.slice(-100);
   }
   let awardedXp=0;
   // Stable lifetime key. A new bank OR policy version cannot re-enable eligibility.
   if(next.status==='COMPLETED'&&runtime.testReward?.audience==='isolated-test'&&
    !d.ledger.some(e=>e.missionId===next.towerId))awardedXp=awardFirstClear(d,next.towerId,1,runtime.testReward.amount);
   const operation={id:cmd.operationId,fingerprint,kind:action.slice(1) as 'start'|'restart'|'submit',runId:next.runId,...(receipt?{receipt}:{}),awardedXp};
   s.operations.push(operation);d.tower=s;
   const document=JSON.stringify(d);
   // Retain all operation receipts; never silently evict an unknown/pending result.
   if(Buffer.byteLength(document,'utf8')>65536)throw new TowerError(503,'RECOVERY_CAPACITY','Expedition receipt capacity reached. No result was committed.');
   if(await store.compareAndSwap(player,row.revision,document))return reply({tower:summary(s,runtime),expeditionRevision:row.revision+1,replayed:false,operation},201);
  }
  throw new TowerError(409,'CAS_RETRY_EXHAUSTED','Another action is saving. Retry the same operation.');
 }catch(e){const status=e instanceof TowerError?e.status:e instanceof StorageUnavailable?503:e instanceof z.ZodError?400:503;
  return reply({code:e instanceof TowerError?e.code:e instanceof z.ZodError?'INVALID_REQUEST':'STORAGE_UNAVAILABLE',
   message:e instanceof TowerError?e.message:'Tower request could not be saved. Retry or recover the same operation.',isLanguageMistake:false,
   ...(latest?{tower:summary(latest,runtime)}:{})},status);}
}
