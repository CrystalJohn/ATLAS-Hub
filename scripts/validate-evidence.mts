import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evidenceMissions} from '../content/evidence/lake.ts';
import {validateEvidence} from '../content/evidence/validate.ts';
import {learningFields} from '../content/evidence/coverage.ts';
import {missionById} from '../content/missions/index.ts';
import {lessonForMission} from '../content/english/chapter.ts';
for(const e of evidenceMissions){
 const m=missionById(e.missionId,e.missionVersion),lesson=lessonForMission(e.missionId)!;
 const errors=validateEvidence(e,learningFields(m,lesson),new Date().toISOString().slice(0,10));
 assert.deepEqual(errors,[],errors.join('\n'));
 for(const v of e.visuals){
  if(v.src.startsWith('/')){const svg=await readFile(new URL(`../public${v.src}`,import.meta.url),'utf8');assert.ok(svg.includes('<title')&&svg.includes('<desc'),`${v.id} needs embedded accessible text`);assert.ok(!/<script|<foreignObject|https?:\/\/[^\s]*\.(png|jpe?g)/i.test(svg),'Local SVG must not execute code or embed unlicensed external media');}
 }
 assert.ok((await readFile(new URL('../public/evidence/LICENSE.txt',import.meta.url),'utf8')).includes('CC'));
 console.log(`PASS evidence publication gate: ${e.missionId} v${e.missionVersion}, ${e.coverage.length} audited fields, ${e.claims.length} claims, ${e.sources.length} sources, ${e.visuals.length} licensed local visuals.`);
}
