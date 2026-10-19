import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {missionGuidance,type GuideInput} from '../app/components/mission-guidance.ts';
let states=0;
for(const type of ['DISCOVERY','REASONING','PUZZLE'] as const)for(const observed of [0,1,2,3])for(const hasAnswer of [false,true])for(const evidenceCount of [0,1,2,3])for(const sequenceCount of [0,3,4,5])for(const hasTransfer of [false,true]){
 const input:GuideInput={type,observed,hasAnswer,evidenceCount,sequenceCount,hasTransfer,totalClues:3,started:true,complete:false};
 const result=missionGuidance(input);
 const canSubmit=type==='PUZZLE'?sequenceCount===4&&hasTransfer:observed===3&&hasAnswer&&(type!=='REASONING'||evidenceCount===2);
 assert.equal(result.ready,canSubmit);assert.equal(result.action==='submit',canSubmit);states++;
}
const base:GuideInput={type:'DISCOVERY',observed:1,totalClues:3,hasAnswer:false,evidenceCount:0,sequenceCount:0,hasTransfer:false,started:true,complete:false};
assert.equal(missionGuidance(base).action,'clue');assert.equal(missionGuidance({...base,observed:3}).action,'question');
assert.equal(missionGuidance({...base,observed:3,hasAnswer:true,type:'REASONING'}).action,'evidence');
assert.equal(missionGuidance({...base,started:false}).action,'begin');assert.equal(missionGuidance({...base,complete:true}).action,'next');
await mkdir('.sites-runtime',{recursive:true});const dir=await mkdtemp('.sites-runtime/guide-test-');
try{
 const compile=async(input:string,output:string,replacements:Record<string,string>={})=>{
  let code=ts.transpileModule(await readFile(input,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  for(const [from,to] of Object.entries(replacements))code=code.replaceAll(from,to);
  await writeFile(`${dir}/${output}`,code);
 };
 await compile('app/components/mission-guidance.ts','mission-guidance.mjs');
 await compile('app/components/MissionGuide.tsx','MissionGuide.mjs',{"'./mission-guidance'":"'./mission-guidance.mjs'"});
 await compile('content/english/forest.ts','forest.mjs');
 await compile('app/components/EnglishLearning.tsx','EnglishLearning.mjs',{"'../../content/english/forest.js'":"'./forest.mjs'"});
 const {MissionGuide}=await import(pathToFileURL(`${process.cwd()}/${dir}/MissionGuide.mjs`).href);
 const props={progress:base,vietnamese:true,busy:false,onVietnamese:()=>{},onAction:()=>{},onHelp:()=>{}};
 const html=renderToStaticMarkup(createElement(MissionGuide,props));
 assert.ok(html.includes('Read the next clue'));assert.ok(html.includes('Còn 2 manh mối'));assert.ok(html.includes('aria-current="step"'));assert.ok(html.includes('How to play'));assert.ok(!html.includes('English practice'));
 const noHelp=renderToStaticMarkup(createElement(MissionGuide,{...props,vietnamese:false}));assert.ok(!noHelp.includes('lang="vi">Chạm'));
 const {EnglishLearning}=await import(pathToFileURL(`${process.cwd()}/${dir}/EnglishLearning.mjs`).href);
 const ep={attemptId:'attempt',observed:1,englishEvidence:[],onState:()=>{},vietnamese:true,onVietnameseChange:()=>{},expanded:true,onExpandedChange:()=>{},onReturnToClues:()=>{},onBusyChange:()=>{}};
 const locked=renderToStaticMarkup(createElement(EnglishLearning,ep));assert.ok(locked.includes('Return to mission clues'));assert.ok(locked.includes('1/3 read'));assert.ok(locked.includes('<fieldset class="english-questions" disabled=""'));
 const ready=renderToStaticMarkup(createElement(EnglishLearning,{...ep,observed:3}));assert.ok(ready.includes('Questions ready'));assert.ok(ready.includes('Question 1'));assert.ok(ready.includes('Question 2'));assert.ok(!ready.includes('Return to mission clues'));assert.ok(ready.includes('Check my English answers'));
 console.log(`PASS: ${states} guidance prerequisite combinations, key navigation transitions and rendered bilingual/English-only controls. Component HTML checks are not live browser tests.`);
}finally{await rm(dir,{recursive:true,force:true});}
