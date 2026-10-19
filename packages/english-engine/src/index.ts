import {z} from 'zod';
import {forestLesson,readingBands} from '../../../content/english/forest.ts';
// Server-only domain logic: never imported by the web component.
const keys = {
 A1:{read:'water',word:'cover'}, A2:{read:'inspect',word:'cover'},
 B1:{read:'sites',word:'cover'}, B2:{read:'qualified',word:'cover'},
} as const;
export const EnglishSubmissionSchema = z.object({
 lessonId:z.literal('forest-field-note'),version:z.literal(1),band:z.enum(readingBands),
 answers:z.object({read:z.string().max(30),word:z.string().max(30)}).strict(),
 support:z.object({vietnamese:z.boolean(),glossary:z.boolean()}).strict(),
}).strict();
export function evaluateEnglish(input:unknown) {
 const s=EnglishSubmissionSchema.parse(input),variant=forestLesson.variants[s.band];
 const items=variant.questions.map(q=>{
  const answer=s.answers[q.id];
  if(!q.options.some(o=>o.id===answer))throw new Error('Unknown answer option');
  const correct=answer===keys[s.band][q.id];
  return {itemId:q.id,skill:q.skill,correct,feedback:correct?'Recorded as item-specific practice evidence.':q.skill==='reading'?'Read the field note again. Check what the writer actually says.':'Look at how the word is used in the field note and example sentences.'};
 });
 return {items,correct:items.every(i=>i.correct),awardedXp:0};
}
