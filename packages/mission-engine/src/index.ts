import { z } from 'zod';
import { type Mission } from '../../../content/missions/index.ts';
export const SubmissionSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('DISCOVERY'),answer:z.string().max(100)}).strict(),
 z.object({type:z.literal('REASONING'),answer:z.string().max(100),evidence:z.array(z.string().max(100)).max(5)}).strict(),
 z.object({type:z.literal('PUZZLE'),sequence:z.array(z.string().max(100)).max(6),transfer:z.string().max(100)}).strict()
]);
export type Submission=z.infer<typeof SubmissionSchema>;
export interface Evaluation { correct:boolean; feedback:string; }
export function evaluate(m:Mission,input:unknown,observed:string[]):Evaluation {
 const s=SubmissionSchema.parse(input); if(s.type!==m.type)throw new Error('Challenge type mismatch');
 if(m.type!=='PUZZLE'&&!m.challenge.observations.every(o=>observed.includes(o.id)))return {correct:false,feedback:'Inspect all three field clues before drawing your conclusion.'};
 if(m.type==='DISCOVERY'&&s.type==='DISCOVERY') return s.answer===m.evaluation.answer?{correct:true,feedback:'Well observed. Changes to one part of an ecosystem can affect the others. The lake trail is now open.'}:{correct:false,feedback:'Trace the connections: fewer trees means less shade; warmer water can affect aquatic life, and birds depend on aquatic insects. Observations alone do not prove a chemical spill.'};
 if(m.type==='REASONING'&&s.type==='REASONING') {
 const option=m.challenge.options.find(o=>o.id===s.answer);
 if(s.answer!==m.evaluation.answer)return {correct:false,feedback:option?.feedback??'Choose a supported explanation.'};
 if(s.evidence.length!==m.evaluation.evidence.length||!m.evaluation.evidence.every(e=>s.evidence.includes(e)))return {correct:false,feedback:'The explanation is sound. Now select exactly the two measured observations that support it. A rumor is not a measurement.'};
 return {correct:true,feedback:option!.feedback};
 }
 if(m.type==='PUZZLE'&&s.type==='PUZZLE'){
 const expected=m.evaluation.sequence;
 if(s.sequence.length!==expected.length||!expected.every((v,i)=>s.sequence[i]===v))return {correct:false,feedback:'Protect fish from immediate oxygen stress first. Then restore native shade, verify sustained recovery, and only then consider reintroduction. Extra fish increase demand for oxygen; clearing trees removes shade.'};
 if(s.transfer!==m.evaluation.transfer)return {correct:false,feedback:'Clear water can still contain too little oxygen. A new oxygen decline means pausing reintroduction and reassessing the cause.'};
 return {correct:true,feedback:'A thoughtful recovery plan. Emergency support buys time; native habitat repairs and sustained measurements guide what happens next. The living lake and Observation Station are now unlocked.'};
 }
 throw new Error('Unsupported evaluator');
}
