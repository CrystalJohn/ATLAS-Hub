import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {lakeEvidence,lakeMeasurements} from '../content/evidence/lake.ts';
import {validateEvidence} from '../content/evidence/validate.ts';
import {learningFields} from '../content/evidence/coverage.ts';
import {missionById,publicMission} from '../content/missions/index.ts';
import {lessonForMission,readingBands} from '../content/english/chapter.ts';
const advanced=JSON.parse(await readFile('content/learning/lake-advanced.json','utf8'));
assert.ok(!('evaluation' in advanced.mission),'Optional client-readable notes must not expose grading keys');
const mission=missionById('disappearing-lake'),fields=learningFields(mission,lessonForMission(mission.id)!);
const check=(e=lakeEvidence,f=fields)=>validateEvidence(e,f,'2026-10-18');
assert.deepEqual(check(),[]);
for(const mutation of [
 (e:any)=>e.claims[0].citations=[],
 (e:any)=>e.claims[0].citations[0].sourceId='missing',
 (e:any)=>e.claims[0].explanation.A1.vi='',
 (e:any)=>e.claims.find((c:any)=>c.id==='case-measurements').classification='real-measurement',
 (e:any)=>e.visuals[0].attribution.license='',
 (e:any)=>e.visuals[0].claimIds=['missing'],
 (e:any)=>e.sources[0].lastVerifiedAt='2099-01-01',
 (e:any)=>e.coverage=[],
 (e:any)=>e.coverage.find((c:any)=>c.classification==='verified-fact').claimIds=[],
]){const e=structuredClone(lakeEvidence);mutation(e);assert.ok(check(e).length,'Invalid evidence must block publication');}
assert.ok(check(lakeEvidence,[...fields,{path:'mission.newFactualStatement',text:'An unsupported claim'}]).length);
assert.ok(check(lakeEvidence,fields.map((f,i)=>i===0?{...f,text:'Changed without an audit'}:f)).length);
assert.ok(check(lakeEvidence,[...fields,{path:'conversation.newFact',text:'An uncited conversation claim'}]).length);
assert.deepEqual(lakeMeasurements.map(s=>[s.temperature,s.oxygen]),[[18,8.8],[28,3.1]]);
assert.ok(!lakeEvidence.claims.some(c=>c.classification==='real-measurement'));
assert.ok(lakeEvidence.claims.find(c=>c.id==='case-conclusion')?.reveal==='after-attempt');
await mkdir('.sites-runtime',{recursive:true});const dir=await mkdtemp('.sites-runtime/evidence-ui-');
try{
 const compile=async(file:string,name:string,replacements:Record<string,string>={})=>{let code=ts.transpileModule(await readFile(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;for(const [a,b] of Object.entries(replacements))code=code.replaceAll(a,b);await writeFile(`${dir}/${name}.mjs`,code);};
 await writeFile(`${dir}/lake-coverage.json`,await readFile('content/evidence/lake-coverage.json'));
 await compile('content/evidence/lake.ts','lake');
 await writeFile(`${dir}/lake-advanced.json`,await readFile('content/learning/lake-advanced.json'));
 await compile('app/components/EvidencePanel.tsx','EvidencePanel', {"'../../content/learning/lake-advanced.json'":"'./lake-advanced.json'"});
 await compile('content/learning/lake-conversation.ts','lake-conversation');
 await compile('app/components/LakeConversation.tsx','LakeConversation',{"'./EvidencePanel'":"'./EvidencePanel.mjs'","'../../content/learning/lake-conversation'":"'./lake-conversation.mjs'"});
 await compile('content/artwork/nature-realm.ts','nature-realm');
 await compile('app/components/LocationArtwork.tsx','LocationArtwork', {"'./EvidencePanel'":"'./EvidencePanel.mjs'"});
 await compile('app/components/LakeInvestigation.tsx','LakeInvestigation',{"'../../content/evidence/lake'":"'./lake.mjs'","'./EvidencePanel'":"'./EvidencePanel.mjs'","'./LocationArtwork'":"'./LocationArtwork.mjs'","'../../content/artwork/nature-realm'":"'./nature-realm.mjs'","'./LakeConversation'":"'./LakeConversation.mjs'"});
 const {EvidencePanel}=await import(pathToFileURL(`${process.cwd()}/${dir}/EvidencePanel.mjs`).href);
 const {LakeInvestigation}=await import(pathToFileURL(`${process.cwd()}/${dir}/LakeInvestigation.mjs`).href);
 for(const band of readingBands)for(const vietnamese of [false,true]){
  const props={evidence:lakeEvidence,band,vietnamese,measurementsReady:true};
  const before=renderToStaticMarkup(createElement(EvidencePanel,props));
  assert.ok(!before.includes('data-claim-id="case-conclusion"'));assert.ok(!before.includes('oxygen-concept.svg'));
  assert.ok(before.includes('<details class="lake-learn-more">'),'Technical content must be optional and collapsed');
  assert.ok(before.includes('Simulated game data')&&before.includes('Not confirmed yet'));
  const after=renderToStaticMarkup(createElement(EvidencePanel,{...props,revealExplanation:true}));
  assert.ok(after.includes('data-claim-id="case-conclusion"'));assert.ok(after.includes('oxygen-concept.svg'));
  assert.equal(after.includes('lang="vi"'),vietnamese);
  for(const s of lakeEvidence.sources){assert.ok(after.includes(s.url));assert.ok(after.includes(s.lastVerifiedAt));}
  assert.ok(after.includes('CC BY 4.0'));assert.ok(after.includes('Original date not stated')||after.includes('Không nêu ngày xuất bản gốc'));
 }
 const props={mission:publicMission(mission),busy:false,band:'A2',vietnamese:true,onRecord:()=>{},onDecide:()=>{}};
 const fresh=renderToStaticMarkup(createElement(LakeInvestigation,{...props,observed:[]}));
 assert.ok(!fresh.includes('lake-comparison.svg'));assert.ok(!fresh.includes('site-readings'));assert.ok(fresh.includes('Inspect this site'));
 const saved=renderToStaticMarkup(createElement(LakeInvestigation,{...props,observed:['temperature','oxygen','screen']}));
 assert.ok(saved.includes('lake-comparison.svg'));assert.ok(saved.includes('<caption>'));assert.ok(saved.includes('scope="col"'));assert.ok(saved.includes('6.0'));assert.ok(saved.includes('8.8'));assert.ok(saved.includes('3.1'));assert.ok(saved.includes('Answer Elara'));
 // Content values, axes and scenario clues agree; graphics do not invent a
 // saturation prediction or universal safety threshold.
 assert.ok(mission.type==='REASONING');if(mission.type==='REASONING'){assert.ok(mission.challenge.observations[0].detail.includes('28°C'));assert.ok(mission.challenge.observations[1].detail.includes('3.1 mg/L'));}
 const chart=await readFile('public/evidence/lake-comparison.svg','utf8');assert.ok(chart.includes('width="270"')&&chart.includes('width="420"'));assert.ok(chart.includes('width="396"')&&chart.includes('width="139.5"'));assert.ok(chart.includes('scale 0–30')&&chart.includes('scale 0–10'));
 console.log('PASS: citation/coverage/metadata publication rejection tests; 4 bands × 2 support modes; explanation withheld before attempt; site inspection states; simulated chart and accessible comparison table. UI interactions verified separately.');
}finally{await rm(dir,{recursive:true,force:true});}
