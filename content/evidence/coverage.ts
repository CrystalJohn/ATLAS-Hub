import advanced from '../learning/lake-advanced.json' with {type:'json'};
import {lakeExchanges} from '../learning/lake-conversation.ts';
import type {Mission} from '../missions/index';
import type {EnglishLesson} from '../english/chapter';
/** Explicit list of mission learning surfaces. Snapshot changes require a new
 * content audit; adding a field must not silently inherit a factual citation. */
function learningFieldsBase(mission:Mission,lesson:EnglishLesson):{path:string;text:string}[]{
 const fields:{path:string;text:string}[]=[];
 const add=(path:string,text:string)=>fields.push({path,text});
 add('mission.title',mission.title);add('mission.narrative',mission.narrative);
 mission.objectives.forEach((text,i)=>add(`mission.objectives.${i}`,text));
 if(mission.type!=='REASONING')throw new Error('This coverage collector currently covers reasoning missions only');
 mission.challenge.observations.forEach((o,i)=>{for(const key of ['title','reading','detail'] as const)add(`mission.observations.${i}.${key}`,o[key]);});
 add('mission.question',mission.challenge.question);
 mission.challenge.options.forEach((o,i)=>{add(`mission.options.${i}.text`,o.text);add(`mission.options.${i}.feedback`,o.feedback);});
 mission.challenge.evidenceOptions.forEach((o,i)=>add(`mission.evidenceOptions.${i}`,o.text));
 for(const [band,v] of Object.entries(lesson.variants)){
  add(`english.${band}.goal`,v.goal);add(`english.${band}.passage`,v.passage);add(`english.${band}.vi`,v.vi);
  v.questions.forEach((q,i)=>{add(`english.${band}.questions.${i}.prompt`,q.prompt);q.options.forEach((o,j)=>add(`english.${band}.questions.${i}.options.${j}`,o.text));});
 }
 lesson.glossary.forEach((g,i)=>{for(const key of ['meaning','explanation','example','exampleVi'] as const)add(`glossary.${i}.${key}`,g[key]);});
 return fields;
}
export function learningFields(mission:Mission,lesson:EnglishLesson):{path:string;text:string}[]{
 const fields=learningFieldsBase(mission,lesson);const add=(path:string,text:string)=>fields.push({path,text});
 // Preserve the original technical copy as separately audited optional material.
 if(mission.id==='disappearing-lake'){
  const original=learningFieldsBase(advanced.mission as Mission,{...lesson,variants:advanced.variants} as EnglishLesson);
  original.forEach(f=>add(`advanced.${f.path}`,f.text));
  lakeExchanges.forEach((item,i)=>{
   add(`conversation.${i}.question.en`,item.question.en);add(`conversation.${i}.question.vi`,item.question.vi);
   for(const [band,reply] of Object.entries(item.reply))add(`conversation.${i}.reply.${band}`,reply);
   add(`conversation.${i}.reply.vi`,item.vi);
  });
 }
 return fields;
}
