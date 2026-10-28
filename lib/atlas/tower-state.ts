import {z} from 'zod';
import {IdSchema,CopySchema,RevisionSchema,type TowerRun} from '../../content/tower/types.ts';

const Choice=z.object({partId:IdSchema,choiceId:IdSchema}).strict();
const Part=z.object({partId:IdSchema,choiceId:IdSchema,correct:z.boolean(),advancesDecision:z.boolean(),
 selectedText:CopySchema,acceptedChoiceId:IdSchema,acceptedText:CopySchema,selectedExplanation:CopySchema,
 correctExplanation:CopySchema,sourceRefs:z.array(z.string()).min(1),remediationId:IdSchema}).strict();
export const ReceiptSchema=z.object({operationId:IdSchema,fingerprint:z.string().length(64),runId:IdSchema,questionId:IdSchema,
 questionRevision:z.number().int().positive(),floor:z.number().int().min(1).max(5),outcome:z.enum(['ADVANCED','FAILED','COMPLETED']),
 resultingRevision:RevisionSchema,clearedFloors:z.number().int().min(0).max(5),advancedDecisions:z.number().int().min(0).max(6),parts:z.array(Part).min(1).max(2)}).strict();
export const RunSchema=z.object({status:z.enum(['IN_PROGRESS','FAILED','COMPLETED']),runId:IdSchema,seed:z.number().int().min(0).max(0xffffffff),
 revision:RevisionSchema,manifestDigest:z.string().length(64),towerId:IdSchema,bankId:IdSchema,bankRevision:z.number().int().positive(),
 ruleVersion:z.literal('c0-atomic-boss-v1'),rewardPolicy:z.literal('DISABLED'),
 pinned:z.array(z.object({id:IdSchema,revision:z.number().int().positive(),floor:z.number().int().min(1).max(5),
 parts:z.array(z.object({id:IdSchema,choiceOrder:z.array(IdSchema).length(3)}).strict()).min(1).max(2)}).strict()).length(5),
 clearedFloors:z.number().int().min(0).max(5),advancedDecisions:z.number().int().min(0).max(6),selections:z.array(Choice).length(0),
 receipts:z.array(ReceiptSchema).max(5),usedRunIds:z.array(IdSchema).max(1000),assignmentHistory:z.array(z.array(IdSchema).length(5)).max(20),
}).strict().superRefine((r,ctx)=>{
 const fail=()=>ctx.addIssue({code:'custom',message:'Invalid persisted run invariant'});
 if(r.revision!==r.receipts.length||new Set(r.receipts.map(x=>x.operationId)).size!==r.receipts.length||
 !r.usedRunIds.includes(r.runId)||new Set(r.usedRunIds).size!==r.usedRunIds.length)fail();
 let cleared=0,advanced=0;
 r.receipts.forEach((x,i)=>{
  const pin=r.pinned[i];let advancing=true;
  x.parts.forEach(p=>{const a=advancing&&p.correct;if(p.advancesDecision!==a)fail();if(a)advanced++;if(!p.correct)advancing=false;});
  const all=x.parts.every(p=>p.correct);if(all)cleared++;
  const outcome=!all?'FAILED':cleared===5?'COMPLETED':'ADVANCED';
  if(x.runId!==r.runId||x.floor!==i+1||x.questionId!==pin.id||x.questionRevision!==pin.revision||
   x.resultingRevision!==i+1||x.outcome!==outcome||x.clearedFloors!==cleared||x.advancedDecisions!==advanced||
   x.parts.length!==pin.parts.length||x.parts.some((p,j)=>p.partId!==pin.parts[j].id)||
   (i<r.receipts.length-1&&outcome!=='ADVANCED'))fail();
 });
 const expected=r.receipts.at(-1)?.outcome;
 if(r.clearedFloors!==cleared||r.advancedDecisions!==advanced||r.status!==(expected==='FAILED'?'FAILED':expected==='COMPLETED'?'COMPLETED':'IN_PROGRESS'))fail();
});
const Operation=z.object({id:IdSchema,fingerprint:z.string().length(64),kind:z.enum(['start','restart','submit']),runId:IdSchema,
 receipt:ReceiptSchema.optional(),awardedXp:z.number().int().min(0)}).strict();
export const TowerNamespaceSchema=z.object({version:z.literal(1),mode:z.literal('CHALLENGE'),supportPolicy:z.literal('EN_WITH_POST_SUBMIT_VI'),definitionVersion:z.literal(1),activeRun:RunSchema.optional(),best:z.number().int().min(0).max(5),
 completed:z.boolean(),operations:z.array(Operation).max(1000),
 mistakes:z.array(z.object({runId:IdSchema,questionId:IdSchema,questionRevision:z.number().int().positive(),partId:IdSchema,
 choiceId:IdSchema,sourceRefs:z.array(z.string()),objectiveIds:z.array(IdSchema),remediationId:IdSchema}).strict()).max(100),
}).strict().superRefine((s,ctx)=>{
 if(new Set(s.operations.map(o=>o.id)).size!==s.operations.length||s.best<(s.activeRun?.clearedFloors??0)||
  (s.completed&&s.best!==5)||(!s.completed&&s.activeRun?.status==='COMPLETED'))ctx.addIssue({code:'custom',message:'Invalid Tower summary'});
});
export type TowerNamespace=z.infer<typeof TowerNamespaceSchema>;
export const emptyTower=():TowerNamespace=>({version:1,mode:'CHALLENGE',supportPolicy:'EN_WITH_POST_SUBMIT_VI',definitionVersion:1,best:0,completed:false,operations:[],mistakes:[]});
export const persistedRun=(run:TowerRun)=>RunSchema.parse(run);
