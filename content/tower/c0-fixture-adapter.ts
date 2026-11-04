/** Local tests only. No application module imports this DRAFT authoring adapter. */
import {z} from 'zod';
import {CopySchema,IdSchema,PartSchema,QuestionSchema,SourceRefSchema,
  type TowerAnswerKeys,type TowerDefinition} from './types.ts';

const AuthorChoice = z.object({id:IdSchema,text:CopySchema,rationale:CopySchema}).strict();
const AuthorPart = PartSchema.extend({options:z.array(AuthorChoice).length(3),answerId:IdSchema}).strict();
const AuthorQuestion = QuestionSchema.extend({parts:z.array(AuthorPart).min(1).max(2)}).strict();
export const C0FixtureSchema = z.object({
  schema:z.literal('C0-editorial-draft-only-v1'),towerId:z.literal('tower:narita-airport-survival'),
  bankId:z.literal('g01-c0-jp-arrival-candidates'),bankRevision:z.literal(1),status:z.literal('DRAFT'),
  sourceCommit:z.literal('e1d07867e799e36bec6c550dca9e4f1dcf258dfe'),date:z.literal('2026-10-26'),
  floorCount:z.literal(5),bossFloor:z.literal(5),records:z.array(AuthorQuestion).length(12),
  publicationEligible:z.literal(false),notes:z.array(z.string().min(1)),
}).strict().superRefine((bank,ctx)=>{
  const fail=(message:string)=>ctx.addIssue({code:'custom',message});
  const ids=bank.records.map(q=>q.id);
  if(new Set(ids).size!==12)fail('Duplicate question IDs');
  const floors=[1,1,1,1,2,2,3,3,4,4,5,5];
  for(let i=1;i<=12;i++){
    const q=bank.records.find(q=>q.id===`g01-c0-air-${String(i).padStart(3,'0')}`);
    if(!q||q.floor!==floors[i-1]||q.revision!==1){fail('C0 IDs, floors and revisions must be preserved');continue;}
    const count=q.floor===5?2:1;
    if(q.parts.length!==count||q.format!==(count===2?'two-part-single-select':'single-select'))fail('Wrong part count/format');
    q.parts.forEach((p,j)=>{
      if(p.id!==`p${j+1}`)fail('Wrong or out-of-order C0 part identity');
      if(new Set(p.options.map(o=>o.id)).size!==3||!p.options.some(o=>o.id===p.answerId))fail('Invalid unique answer membership');
      if(new Set(p.options.map(o=>o.text.en)).size!==3)fail('Duplicate choice text');
      if(p.sourceRefs.some(s=>!SourceRefSchema.safeParse(s).success))fail('Unknown provenance');
    });
  }
});

/** Pure split: preserves all authored metadata while removing evaluation fields. */
export function adaptC0Fixture(raw:unknown):{definition:TowerDefinition;answerKeys:TowerAnswerKeys}{
  const bank=C0FixtureSchema.parse(raw);
  const definition:TowerDefinition={
    towerId:bank.towerId,definitionVersion:1,bankId:bank.bankId,bankRevision:bank.bankRevision,
    status:bank.status,publicationEligible:false,floorCount:5,bossFloor:5,rewardPolicy:'DISABLED',
    ruleVersion:'c0-atomic-boss-v1',origin:{schema:bank.schema,date:bank.date,sourceCommit:bank.sourceCommit,
      sourceDocument:'docs/game-01/c0/C0-question-bank-candidates.json',
      provenanceDocument:'docs/game-01/c0/C0-learning-objectives-and-provenance.md',notes:bank.notes},
    questions:bank.records.map(({parts,...q})=>({...q,parts:parts.map(p=>({
      id:p.id,stem:p.stem,options:p.options.map(o=>({id:o.id,text:o.text})),
      sourceRefs:p.sourceRefs,objectiveIds:p.objectiveIds,remediationId:p.remediationId,
    }))})),
  };
  const answerKeys:TowerAnswerKeys={bankId:bank.bankId,bankRevision:bank.bankRevision,
    questions:bank.records.map(q=>({id:q.id,revision:q.revision,parts:q.parts.map(p=>({
      id:p.id,answerId:p.answerId,feedback:p.options.map(o=>({choiceId:o.id,rationale:o.rationale})),
    }))})),
  };
  return {definition,answerKeys};
}
