import {createHash} from 'node:crypto';
import {z} from 'zod';
import {DefinitionSchema,KeysSchema,IdSchema,RevisionSchema,
  type DeepReadonly,type ErrorCode,type PinnedQuestion,type Receipt,
  type TowerPresentation,type TowerQuestion,type TowerRun,type TowerState,type TransitionResult,
} from '../../../content/tower/types.ts';

const StartCommand=z.object({runId:IdSchema,seed:z.number().int().min(0).max(0xffffffff)}).strict();
const Target={runId:IdSchema,expectedRunRevision:RevisionSchema,questionId:IdSchema,
  questionRevision:z.number().int().positive()};
const SelectCommand=z.object({...Target,partId:IdSchema,choiceId:IdSchema}).strict();
const SubmitCommand=z.object({...Target,operationId:IdSchema,confirmed:z.literal(true),
  answers:z.array(z.object({partId:IdSchema,choiceId:IdSchema}).strict()).min(1).max(2),
}).strict();
const RestartCommand=StartCommand.extend({previousRunId:IdSchema,expectedRunRevision:RevisionSchema}).strict();

function canonical(value:unknown):string{
  if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
  if(value!==null&&typeof value==='object')return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0)
    .map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
function digest(value:unknown){return createHash('sha256').update(canonical(value)).digest('hex');}
function freeze<T>(value:T):DeepReadonly<T>{
  if(value!==null&&typeof value==='object'){
    for(const item of Object.values(value))freeze(item);
    Object.freeze(value);
  }
  return value as DeepReadonly<T>;
}
const error=(state:TowerState,code:ErrorCode,message:string):TransitionResult=>
  ({ok:false,state,error:{code,message,isLanguageMistake:false}});
const success=(state:TowerState,receipt?:DeepReadonly<Receipt>,replayed=false):TransitionResult=>
  ({ok:true,state,replayed,...(receipt?{receipt}:{})});

// Fixed uint32 PRNG: randomness is entirely supplied by the caller's seed.
function random(seed:number){
  let n=seed;
  return ()=>{n=(n+0x6d2b79f5)>>>0;let t=n;t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
function shuffle<T>(items:readonly T[],next:()=>number):T[]{
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(next()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}

/**
 * Trusted local/server factory. No I/O, clock, global randomness, player state or rewards.
 * Commands are untrusted; run snapshots and evaluator construction must be server-owned in T2.
 * A reducer result is a proposed state until T2 commits it atomically with its receipt.
 */
export function createTowerEngine(rawDefinition:unknown,rawKeys:unknown){
  // Zod parses into isolated copies; caller mutation cannot change a running evaluator.
  const definition=DefinitionSchema.parse(rawDefinition),keys=KeysSchema.parse(rawKeys);
  const demand=(condition:boolean,message:string)=>{if(!condition)throw new Error(`Invalid Tower content: ${message}`);};
  demand(keys.bankId===definition.bankId&&keys.bankRevision===definition.bankRevision,'bank/key version mismatch');
  demand(new Set(definition.questions.map(q=>q.id)).size===definition.questions.length,'duplicate question ID');
  demand(new Set(keys.questions.map(q=>q.id)).size===keys.questions.length&&keys.questions.length===definition.questions.length,'duplicate or extra keys');
  for(const q of definition.questions){
    demand(q.parts.length===(q.floor===5?2:1),'floor decision count');
    demand(q.format===(q.floor===5?'two-part-single-select':'single-select'),'format does not match floor');
    demand(new Set(q.parts.map(p=>p.id)).size===q.parts.length,'duplicate part ID');
    const k=keys.questions.find(k=>k.id===q.id&&k.revision===q.revision);
    demand(!!k&&k.parts.length===q.parts.length&&new Set(k.parts.map(p=>p.id)).size===q.parts.length,'missing or duplicate part keys');
    for(const p of q.parts){
      demand(new Set(p.options.map(c=>c.id)).size===p.options.length,'duplicate choice ID');
      demand(new Set(p.options.map(c=>c.text.en)).size===p.options.length,'duplicate choice text');
      const key=k!.parts.find(k=>k.id===p.id);
      demand(!!key&&p.options.some(c=>c.id===key.answerId),'answer is not a member');
      demand(new Set(key!.feedback.map(f=>f.choiceId)).size===p.options.length&&
        p.options.every(c=>key!.feedback.some(f=>f.choiceId===c.id)),'missing choice explanation');
    }
  }
  const buckets=Array.from({length:5},(_,i)=>definition.questions.filter(q=>q.floor===i+1)
    .sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0));
  buckets.forEach(b=>demand(b.length>=2,'each floor requires two meaningful candidate variants'));
  const manifestDigest=digest({definition,keys});
  freeze(definition);freeze(keys);

  function compatible(state:TowerRun):boolean{
    return state.manifestDigest===manifestDigest&&state.towerId===definition.towerId&&
      state.bankId===definition.bankId&&state.bankRevision===definition.bankRevision&&
      state.ruleVersion===definition.ruleVersion&&state.rewardPolicy==='DISABLED'&&
      state.pinned.length===5&&state.pinned.every((pin,i)=>{
        const q=buckets[i].find(q=>q.id===pin.id&&q.revision===pin.revision);
        return !!q&&pin.floor===i+1&&pin.parts.length===q.parts.length&&pin.parts.every((p,j)=>
          p.id===q.parts[j].id&&p.choiceOrder.length===q.parts[j].options.length&&
          new Set(p.choiceOrder).size===p.choiceOrder.length&&p.choiceOrder.every(c=>q.parts[j].options.some(o=>o.id===c)));
      });
  }
  function current(state:TowerRun):TowerQuestion|undefined{
    const pin=state.pinned[state.clearedFloors];
    return pin?definition.questions.find(q=>q.id===pin.id&&q.revision===pin.revision):undefined;
  }
  function targetError(state:TowerState,cmd:z.infer<typeof SelectCommand>|z.infer<typeof SubmitCommand>):TransitionResult|undefined{
    if(state.status==='NOT_STARTED')return error(state,'INVALID_STATE','Start a run first.');
    if(state.runId!==cmd.runId)return error(state,'WRONG_RUN','This command belongs to another run.');
    if(!compatible(state))return error(state,'CONTENT_MISMATCH','Recover the pinned content version.');
    if(state.status!=='IN_PROGRESS')return error(state,'INVALID_STATE','This run is terminal.');
    if(state.revision!==cmd.expectedRunRevision)return error(state,'STALE_REVISION','Recover the latest run result.');
    const q=current(state);
    if(!q||q.id!==cmd.questionId||q.revision!==cmd.questionRevision)return error(state,'WRONG_QUESTION','Use the current pinned question and revision.');
  }
  function newRun(runId:string,seed:number,previous?:TowerRun):TowerRun{
    const next=random(seed),history=previous?.assignmentHistory??[];
    const pinned:PinnedQuestion[]=buckets.map(bucket=>{
      const last=history.at(-1)??[];
      const candidates=bucket.filter(q=>!last.includes(q.id));
      const lastSeen=(q:TowerQuestion)=>history.map(ids=>ids.includes(q.id)).lastIndexOf(true);
      const least=Math.min(...candidates.map(lastSeen));
      const pool=candidates.filter(q=>lastSeen(q)===least);
      const q=pool[Math.floor(next()*pool.length)];
      return {id:q.id,revision:q.revision,floor:q.floor,parts:q.parts.map(p=>({id:p.id,choiceOrder:shuffle(p.options.map(c=>c.id),next)}))};
    });
    return freeze({status:'IN_PROGRESS',runId,seed,revision:0,manifestDigest,
      towerId:definition.towerId,bankId:definition.bankId,bankRevision:definition.bankRevision,
      ruleVersion:definition.ruleVersion,rewardPolicy:'DISABLED',pinned,clearedFloors:0,advancedDecisions:0,
      selections:[],receipts:[],usedRunIds:[...(previous?.usedRunIds??[]),runId],
      assignmentHistory:[...history,pinned.map(p=>p.id)].slice(-20),
    });
  }

  function start(state:TowerState,input:unknown):TransitionResult{
    const parsed=StartCommand.safeParse(input);
    if(!parsed.success)return error(state,'INVALID_REQUEST','Invalid start command.');
    if(state.status!=='NOT_STARTED')return error(state,'INVALID_STATE','A run already exists; restart only after failure.');
    return success(newRun(parsed.data.runId,parsed.data.seed));
  }
  function restart(state:TowerState,input:unknown):TransitionResult{
    const parsed=RestartCommand.safeParse(input);
    if(!parsed.success)return error(state,'INVALID_REQUEST','Invalid restart command.');
    const cmd=parsed.data;
    if(state.status!=='FAILED')return error(state,'INVALID_STATE','Only a failed run can restart in T1.');
    if(state.runId!==cmd.previousRunId)return error(state,'WRONG_RUN','Wrong previous run.');
    if(!compatible(state))return error(state,'CONTENT_MISMATCH','Recover the pinned content version.');
    if(state.revision!==cmd.expectedRunRevision)return error(state,'STALE_REVISION','Recover the latest result.');
    if(state.usedRunIds.includes(cmd.runId))return error(state,'RUN_ID_REUSED','Restart requires a new run identity.');
    return success(newRun(cmd.runId,cmd.seed,state));
  }
  function select(state:TowerState,input:unknown):TransitionResult{
    const parsed=SelectCommand.safeParse(input);
    if(!parsed.success)return error(state,'INVALID_REQUEST','Invalid selection command.');
    const cmd=parsed.data,problem=targetError(state,cmd);
    if(problem)return problem;
    const run=state as TowerRun,q=current(run)!,part=q.parts.find(p=>p.id===cmd.partId);
    if(!part||!part.options.some(c=>c.id===cmd.choiceId))return error(state,'INVALID_CHOICE','Choose an available part and option.');
    const selections=q.parts.flatMap(p=>{
      const selected=p.id===cmd.partId?{partId:cmd.partId,choiceId:cmd.choiceId}:run.selections.find(s=>s.partId===p.id);
      return selected?[selected]:[];
    });
    // Draft editing has no scoring revision, receipt, grading or decision advancement.
    return success(freeze({...structuredClone(run),selections:structuredClone(selections)}));
  }
  function submit(state:TowerState,input:unknown):TransitionResult{
    const parsed=SubmitCommand.safeParse(input);
    if(!parsed.success)return error(state,'INVALID_REQUEST','Confirm a complete, valid answer command.');
    const cmd=parsed.data;
    if(state.status==='NOT_STARTED')return error(state,'INVALID_STATE','Start a run first.');
    if(state.runId!==cmd.runId)return error(state,'WRONG_RUN','This submission belongs to another run.');
    const fingerprint=digest({runId:cmd.runId,questionId:cmd.questionId,questionRevision:cmd.questionRevision,
      answers:[...cmd.answers].sort((a,b)=>a.partId<b.partId?-1:a.partId>b.partId?1:0)});
    // Durable replay semantics: receipt BEFORE revision, content or terminal-state checks.
    const old=state.receipts.find(r=>r.operationId===cmd.operationId);
    if(old)return old.fingerprint===fingerprint?success(state,old,true):error(state,'OPERATION_CONFLICT','Operation identity was used with different answers.');
    const problem=targetError(state,cmd);if(problem)return problem;
    const q=current(state)!;
    if(cmd.answers.length!==q.parts.length||new Set(cmd.answers.map(a=>a.partId)).size!==q.parts.length||
      cmd.answers.some(a=>!q.parts.some(p=>p.id===a.partId&&p.options.some(c=>c.id===a.choiceId))))
      return error(state,'INVALID_CHOICE','Supply exactly one known choice for every required part.');
    if(state.selections.length!==q.parts.length)return error(state,'INCOMPLETE_SELECTION','Select all required parts before confirming.');
    if(cmd.answers.some(a=>!state.selections.some(s=>s.partId===a.partId&&s.choiceId===a.choiceId)))
      return error(state,'SELECTION_MISMATCH','Review the changed selections before confirming.');
    const key=keys.questions.find(k=>k.id===q.id&&k.revision===q.revision)!;
    let advancing=true,advancedDecisions=state.advancedDecisions;
    // Evaluate both boss parts for honest feedback; advancement stops at the first wrong part.
    const parts=q.parts.map(p=>{
      const choiceId=cmd.answers.find(a=>a.partId===p.id)!.choiceId,k=key.parts.find(k=>k.id===p.id)!;
      const correct=choiceId===k.answerId,advancesDecision=advancing&&correct;
      if(advancesDecision)advancedDecisions++;
      if(!correct)advancing=false;
      return {partId:p.id,choiceId,correct,advancesDecision,
        selectedText:p.options.find(c=>c.id===choiceId)!.text,acceptedChoiceId:k.answerId,
        acceptedText:p.options.find(c=>c.id===k.answerId)!.text,
        selectedExplanation:k.feedback.find(f=>f.choiceId===choiceId)!.rationale,
        correctExplanation:k.feedback.find(f=>f.choiceId===k.answerId)!.rationale,
        sourceRefs:p.sourceRefs,remediationId:p.remediationId};
    });
    const allCorrect=parts.every(p=>p.correct),clearedFloors=state.clearedFloors+(allCorrect?1:0);
    const status:TowerRun['status']=!allCorrect?'FAILED':clearedFloors===5?'COMPLETED':'IN_PROGRESS';
    const receipt:Receipt={operationId:cmd.operationId,fingerprint,runId:state.runId,questionId:q.id,
      questionRevision:q.revision,floor:q.floor,outcome:status==='IN_PROGRESS'?'ADVANCED':status,
      resultingRevision:state.revision+1,clearedFloors,advancedDecisions,parts};
    const result=freeze({...structuredClone(state),status,revision:receipt.resultingRevision,
      clearedFloors,advancedDecisions,selections:[],receipts:[...structuredClone(state.receipts),receipt]});
    return success(result,freeze(receipt));
  }
  function present(state:TowerState):TowerPresentation{
    const base:TowerPresentation={status:state.status,draft:true,publicationEligible:false,floorCount:5};
    if(state.status==='NOT_STARTED')return base;
    if(!compatible(state))throw new Error('CONTENT_MISMATCH: cannot present a different content manifest');
    Object.assign(base,{runId:state.runId,revision:state.revision,clearedFloors:state.clearedFloors});
    if(state.status!=='IN_PROGRESS')return base;
    const q=current(state);if(!q)throw new Error('INVALID_STATE: missing current question');
    const pin=state.pinned[state.clearedFloors];
    base.question={id:q.id,revision:q.revision,floor:q.floor,stimulus:q.stimulus.en,
      parts:q.parts.map((p,i)=>({id:p.id,stem:p.stem.en,options:pin.parts[i].choiceOrder.map(id=>({
        id,text:p.options.find(c=>c.id===id)!.text.en})),
        ...(state.selections.find(s=>s.partId===p.id)?{selectedChoiceId:state.selections.find(s=>s.partId===p.id)!.choiceId}:{})}))};
    return base;
  }
  return Object.freeze({initialState:():TowerState=>freeze({status:'NOT_STARTED'}),start,restart,select,submit,present});
}
