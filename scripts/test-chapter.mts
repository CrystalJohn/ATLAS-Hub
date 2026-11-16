import assert from 'node:assert/strict';
import {chapterLessons,readingBands} from '../content/english/chapter.ts';
import {evaluateEnglishItem} from '../packages/english-engine/src/chapter.ts';
const answers={
 'forest-field-note':{A1:{read:'water',word:'cover'},A2:{read:'inspect',word:'cover'},B1:{read:'sites',word:'cover'},B2:{read:'qualified',word:'cover'}},
 'lake-field-note':{A1:{read:'evidence',word:'measure'},A2:{read:'evidence',word:'measure'},B1:{read:'evidence',word:'measure'},B2:{read:'evidence',word:'measure'}},
 'grove-field-note':{A1:{read:'pause',word:'order'},A2:{read:'pause',word:'order'},B1:{read:'pause',word:'order'},B2:{read:'pause',word:'order'}},
} as const;
function payload(lessonId:string,band:'A1'|'A2'|'B1'|'B2',itemId:'read'|'word',answer:string){return {lessonId,version:1,band,itemId,answer,support:{vietnamese:true,glossary:true}};}
let variants=0;
for(const l of chapterLessons)for(const band of readingBands){
 assert.equal(l.variants[band].questions.length,2);assert.ok(l.glossary.length>=4);
 for(const q of l.variants[band].questions){
  const key=answers[l.id as keyof typeof answers][band][q.id];
  const good=evaluateEnglishItem(payload(l.id,band,q.id,key));assert.equal(good.correct,true);assert.equal(good.awardedXp,0);assert.ok(good.explanationVi.length>25);assert.ok(l.variants[band].passage.includes(good.quote),`${l.id}/${band}/${q.id} has a nonliteral evidence excerpt: ${good.quote}`);
  const wrong=q.options.find(o=>o.id!==key)!;assert.equal(evaluateEnglishItem(payload(l.id,band,q.id,wrong.id)).correct,false);variants++;
 }
}
console.log(`PASS: ${variants} band/item English gradings with literal evidence excerpts and zero XP.`);
