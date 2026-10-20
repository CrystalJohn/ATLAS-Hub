import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {emptyProgress,projection} from '../packages/domain/src/index.ts';
import {missions,publicMission} from '../content/missions/index.ts';
import {chapterLessons,readingBands,lessonForMission} from '../content/english/chapter.ts';
import {translateVietnamese} from '../content/localization/vi.ts';
import {evaluate} from '../packages/mission-engine/src/index.ts';
await mkdir('.sites-runtime',{recursive:true});const dir=await mkdtemp('.sites-runtime/chapter-ui-');
try{
 const compile=async(input:string,name:string,replacements:Record<string,string>={})=>{let code=ts.transpileModule(await readFile(input,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace(/from (['\"])([^'\"]+\.json)\1;/g,"from '$2' with {type:'json'};");for(const [a,b] of Object.entries(replacements))code=code.replaceAll(a,b);code=code.replaceAll("'./InterestSuggestions'","'./InterestSuggestions.mjs'").replaceAll("'./AdventureRecovery'","'./AdventureRecovery.mjs'").replaceAll("'./Bilingual'","'./Bilingual.mjs'").replaceAll("'../Bilingual'","'./Bilingual.mjs'");await writeFile(`${dir}/${name}.mjs`,code);};
 await compile('content/english/forest.ts','forest');await compile('content/english/chapter.ts','chapter',{"'./forest.ts'":"'./forest.mjs'"});
 await compile('content/localization/vi.ts','vi');
 await compile('app/components/Bilingual.tsx','Bilingual', {"'../../content/localization/vi'":"'./vi.mjs'"});
 await compile('app/components/MissionStory.tsx','MissionStory', {"'./Bilingual'":"'./Bilingual.mjs'","'../../content/localization/vi'":"'./vi.mjs'"});
 await compile('app/components/chapter-types.ts','chapter-types');await compile('app/components/TrailBadge.tsx','TrailBadge');await compile('app/components/World.tsx','World');
 await compile('content/english/vocabulary.ts','vocabulary');
 await compile('content/travel/japan.ts','travel-japan');
 await writeFile(`${dir}/world-map.json`,await readFile('content/travel/world-map.json'));await writeFile(`${dir}/region-codes.json`,await readFile('content/travel/region-codes.json'));
 await compile('content/travel/catalog.ts','travel-catalog',{"'./world-map.json'":"'./world-map.json'","'./region-codes.json'":"'./region-codes.json'","'./japan'":"'./travel-japan.mjs'"});
 await compile('content/travel/types.ts','travel-types');
 await compile('app/components/travel/TravelCopy.tsx','TravelCopy');
 await compile('app/components/travel/WorldSelector.tsx','WorldSelector',{"'../../../content/travel/catalog'":"'./travel-catalog.mjs'","'../../../content/travel/japan'":"'./travel-japan.mjs'","'./TravelCopy'":"'./TravelCopy.mjs'"});
 await compile('app/components/travel/TravelEncounterView.tsx','TravelEncounterView',{"'../../../content/travel/japan'":"'./travel-japan.mjs'","'./TravelCopy'":"'./TravelCopy.mjs'","'../SavedVocabulary'":"'./SavedVocabulary.mjs'"});
 await compile('app/components/travel/WorldTravel.tsx','WorldTravel',{"'../../../content/travel/japan'":"'./travel-japan.mjs'","'../../../content/travel/types'":"'./travel-types.mjs'","'../SavedVocabulary'":"'./SavedVocabulary.mjs'","'../chapter-types'":"'./chapter-types.mjs'","'./TravelCopy'":"'./TravelCopy.mjs'","'./WorldSelector'":"'./WorldSelector.mjs'","'./TravelEncounterView'":"'./TravelEncounterView.mjs'"});
 await compile('content/english/pronunciation.ts','pronunciation',{"'../travel/japan.ts'":"'./travel-japan.mjs'"});
 await compile('app/components/SavedVocabulary.tsx','SavedVocabulary',{"'../../content/travel/japan'":"'./travel-japan.mjs'","'../../content/english/chapter'":"'./chapter.mjs'","'../../content/english/vocabulary'":"'./vocabulary.mjs'","'../../content/english/pronunciation'":"'./pronunciation.mjs'","'./chapter-types'":"'./chapter-types.mjs'","'./Bilingual'":"'./Bilingual.mjs'"});
 await compile('content/english/word-details.ts','word-details');
 await compile('app/components/VocabularyNotebook.tsx','VocabularyNotebook',{"'../../content/english/word-details'":"'./word-details.mjs'","'./Bilingual'":"'./Bilingual.mjs'","'./SavedVocabulary'":"'./SavedVocabulary.mjs'"});
 await compile('app/components/WordHelpPopover.tsx','WordHelpPopover',{"'./Bilingual'":"'./Bilingual.mjs'","'./SavedVocabulary'":"'./SavedVocabulary.mjs'"});
 await compile('app/components/ChapterEnglish.tsx','ChapterEnglish',{"'./chapter-types'":"'./chapter-types.mjs'","'./TrailBadge'":"'./TrailBadge.mjs'","'./Bilingual'":"'./Bilingual.mjs'","'./WordHelpPopover'":"'./WordHelpPopover.mjs'"});
 await compile('content/evidence/lake.ts','lake', {"'./lake-coverage.json'":"'./lake-coverage.json'"});
 await writeFile(`${dir}/lake-coverage.json`,await readFile('content/evidence/lake-coverage.json'));
 await writeFile(`${dir}/lake-advanced.json`,await readFile('content/learning/lake-advanced.json'));
 await compile('app/components/EvidencePanel.tsx','EvidencePanel', {"'../../content/learning/lake-advanced.json'":"'./lake-advanced.json'"});
 await compile('content/learning/lake-conversation.ts','lake-conversation');
 await compile('app/components/LakeConversation.tsx','LakeConversation',{"'./EvidencePanel'":"'./EvidencePanel.mjs'","'../../content/learning/lake-conversation'":"'./lake-conversation.mjs'"});
 await compile('content/artwork/nature-realm.ts','nature-realm');
 await compile('app/components/LocationArtwork.tsx','LocationArtwork', {"'./EvidencePanel'":"'./EvidencePanel.mjs'"});
 await compile('app/components/LakeInvestigation.tsx','LakeInvestigation', {"'../../content/evidence/lake'":"'./lake.mjs'","'./EvidencePanel'":"'./EvidencePanel.mjs'","'./LocationArtwork'":"'./LocationArtwork.mjs'","'../../content/artwork/nature-realm'":"'./nature-realm.mjs'","'./LakeConversation'":"'./LakeConversation.mjs'"});
 await compile('app/components/AuthGate.tsx','AuthGate');
 await compile('app/components/AdventureRecovery.tsx','AdventureRecovery');
 await compile('content/interests.ts','interests');
 await compile('lib/atlas/profile.ts','profile',{"'../../content/interests.ts'":"'./interests.mjs'"});
 await compile('lib/atlas/recommendations.ts','recommendations',{"'../../content/travel/japan.ts'":"'./travel-japan.mjs'"});
 await compile('app/components/InterestSuggestions.tsx','InterestSuggestions',{"'../../content/interests'":"'./interests.mjs'","'../../lib/atlas/recommendations'":"'./recommendations.mjs'"});
 await compile('app/components/useAccountProfile.ts','useAccountProfile',{"'./chapter-types'":"'./chapter-types.mjs'"});
 await compile('app/components/AccountMenu.tsx','AccountMenu',{"'../../content/english/chapter'":"'./chapter.mjs'","'../../lib/atlas/profile'":"'./profile.mjs'","'../../content/interests'":"'./interests.mjs'"});
 await compile('app/components/Game.tsx','Game',{"'./AdventureRecovery'":"'./AdventureRecovery.mjs'","'./AuthGate'":"'./AuthGate.mjs'","'./AccountMenu'":"'./AccountMenu.mjs'","'./useAccountProfile'":"'./useAccountProfile.mjs'","'../../content/english/chapter'":"'./chapter.mjs'","'./chapter-types'":"'./chapter-types.mjs'","'./ChapterEnglish'":"'./ChapterEnglish.mjs'","'./TrailBadge'":"'./TrailBadge.mjs'","'./World'":"'./World.mjs'","'./Bilingual'":"'./Bilingual.mjs'","'./MissionStory'":"'./MissionStory.mjs'","'./EvidencePanel'":"'./EvidencePanel.mjs'","'./LakeInvestigation'":"'./LakeInvestigation.mjs'","'../../content/evidence/lake'":"'./lake.mjs'","'./SavedVocabulary'":"'./SavedVocabulary.mjs'","'./VocabularyNotebook'":"'./VocabularyNotebook.mjs'","'./travel/WorldTravel'":"'./WorldTravel.mjs'"});
 const {default:Game}=await import(pathToFileURL(`${process.cwd()}/${dir}/Game.mjs`).href);
 const {InterfaceLanguage}=await import(pathToFileURL(`${process.cwd()}/${dir}/Bilingual.mjs`).href);
 const inLocale=(locale:'en'|'vi',node:any)=>createElement(InterfaceLanguage,{value:{locale,setLocale:()=>{}}},node);
 const fresh={...projection(emptyProgress()),missions:missions.map(publicMission),attempts:[],ledger:[],englishReview:[]};
 const html=renderToStaticMarkup(createElement(Game,{initialState:fresh}));
 assert.ok(html.includes('A little English.'));assert.ok(html.includes('Begin my adventure'));assert.ok(html.includes('TRAIL LOCKED'));assert.ok(html.includes('My journal'));assert.ok(html.includes('Reading target'));assert.ok(html.includes('aria-label="Main navigation"'));assert.ok(html.includes('0/6'));assert.ok(!html.includes('>Hành trình<'));assert.ok(!html.includes('>Sổ tay<'));assert.ok(html.includes('Switch interface to Vietnamese'));const viHtml=renderToStaticMarkup(inLocale('vi',createElement(Game,{initialState:fresh})));assert.ok(viHtml.includes('Hành trình'));assert.ok(viHtml.includes('Sổ tay'));assert.ok(viHtml.includes('Cách chơi'));assert.ok(!viHtml.includes('>Journey<'));assert.ok(!viHtml.includes('translation-copy'));assert.ok(!html.includes('Recorded as item-specific'));
 const full={...fresh,...projection({xp:210,completed:missions.map(m=>m.id),evidence:['observation','causal-reasoning','recovery-transfer'],englishEvidence:chapterLessons.flatMap(l=>l.variants.A2.questions.map(q=>({key:`${l.id}:v1:A2:${q.id}`,missionId:l.missionId,lessonId:l.id,version:1,band:'A2' as const,skill:q.skill,itemId:q.id,attemptId:'done',support:{vietnamese:true,glossary:true},recordedAt:new Date().toISOString()})))})};
 const returning=renderToStaticMarkup(createElement(Game,{initialState:full}));assert.ok(returning.includes('See my expedition recap'));assert.ok(returning.includes('6/6'));assert.ok(!returning.includes('TRAIL LOCKED'));assert.ok(returning.includes('Review &amp; practise'));
 const {ChapterEnglish}=await import(pathToFileURL(`${process.cwd()}/${dir}/ChapterEnglish.mjs`).href);
 let variants=0;for(const lesson of chapterLessons)for(const band of readingBands){const props={lesson,band,attemptId:'owned-attempt',vietnamese:true,onSupport:()=>{},onState:()=>{},onBusy:()=>{},onContinue:()=>{}};const read=renderToStaticMarkup(createElement(ChapterEnglish,props));assert.ok(read.includes('Start 2 questions'));assert.ok(read.includes('Giải thích tiếng Việt'));assert.ok(read.includes('<details class="translation"')&&!read.includes('translation-visible'));assert.ok(read.includes(lesson.variants[band].vi));assert.ok(read.includes(lesson.title));assert.ok(read.includes('Skip practice'));assert.ok(read.includes('EDUCATOR')||read.includes('educator'));const review=renderToStaticMarkup(createElement(ChapterEnglish,{...props,initialItems:['word'],vietnamese:false}));assert.ok(review.includes('Start 1 question'));assert.ok(!review.includes('translation-visible'));assert.ok(!review.includes('class="translation-copy"'));assert.ok(!review.includes(lesson.variants[band].vi));variants++;}
 const {MissionStory}=await import(pathToFileURL(`${process.cwd()}/${dir}/MissionStory.mjs`).href);
 const {VietnameseSupport,Bilingual}=await import(pathToFileURL(`${process.cwd()}/${dir}/Bilingual.mjs`).href);
 const {VocabularyContext,SavedWords,SaveWordButton}=await import(pathToFileURL(`${process.cwd()}/${dir}/SavedVocabulary.mjs`).href);
 const savedWords=chapterLessons.flatMap(lesson=>lesson.glossary.map(entry=>({lessonId:lesson.id,version:lesson.version,word:entry.word,savedAt:'2026-10-19T00:00:00Z'})));
 const vocabularyStore={words:savedWords,loading:false,pending:false,error:'',reload:()=>{},toggle:async()=>{}};
 for(const vietnamese of [false,true]){
  const saved=renderToStaticMarkup(createElement(VietnameseSupport,{value:vietnamese},createElement(VocabularyContext.Provider,{value:vocabularyStore},createElement(SavedWords,{vietnamese}))));
  assert.equal((saved.match(/lang="en-US"/g)||[]).length,12);assert.equal((saved.match(/lang="en-GB"/g)||[]).length,12);assert.equal(saved.includes('lang="vi"'),vietnamese);assert.ok(saved.includes('Cambridge'));assert.ok(saved.includes(vietnamese?'Bỏ lưu: canopy':'Remove saved word: canopy'));
 }
 const wordButton=renderToStaticMarkup(createElement(VocabularyContext.Provider,{value:vocabularyStore},createElement(SaveWordButton,{lessonId:'forest-field-note',version:1,word:'canopy'})));assert.ok(wordButton.includes('aria-pressed="true"')&&wordButton.includes('Saved to My journal'));
 const failedSave=renderToStaticMarkup(createElement(VocabularyContext.Provider,{value:{...vocabularyStore,words:[],error:'Could not save this word. Try again.'}},createElement(SaveWordButton,{lessonId:'forest-field-note',version:1,word:'canopy'})));assert.ok(failedSave.includes('role="alert"')&&failedSave.includes('Retry'));assert.ok(!failedSave.includes('Saved to My journal'));
 const escape=(text:string)=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
 let assisted=0;
 for(const [i,mission] of missions.entries()){
  const lesson=lessonForMission(mission.id)!;
  const content=[mission.title,mission.narrative,...mission.objectives];
  if(mission.type==='PUZZLE')content.push(mission.challenge.transferQuestion,...mission.challenge.actions.flatMap(a=>[a.text,a.detail]),...mission.challenge.transferOptions.map(o=>o.text));
  else{
   content.push(mission.challenge.question,...mission.challenge.observations.flatMap(o=>[o.title,o.detail]),...mission.challenge.options.map(o=>o.text));
   if(mission.type==='REASONING')content.push(...mission.challenge.evidenceOptions.map(o=>o.text),...mission.challenge.options.map(o=>o.feedback));
  }
  for(const band of readingBands){
   const props={mission:publicMission(mission),lesson,band,missionIndex:i,accent:'blue',completed:false,vietnamese:true,onStart:()=>{}};
   const story=renderToStaticMarkup(createElement(VietnameseSupport,{value:true},createElement(MissionStory,props)));
   for(const text of [mission.narrative,...mission.objectives,lesson.variants[band].goal]){
    assert.ok(story.includes(escape(text)),`English stays visible: ${text}`);
    assert.ok(story.includes(escape(translateVietnamese(text)!)),`Vietnamese available in mission story: ${text}`);
   }
   const viStory=renderToStaticMarkup(inLocale('vi',createElement(VietnameseSupport,{value:true},createElement(MissionStory,props))));assert.ok(viStory.includes(escape(translateVietnamese(mission.title)!)));
   assert.ok(story.includes('data-translation-mode="on-demand"')&&story.includes('Xem khi cần')&&story.includes('Xem tiếng Việt'));
   assert.ok(!story.includes('<details class="story-translation" open'),'Translations wait for an explicit reveal');
   const englishOnly=renderToStaticMarkup(createElement(VietnameseSupport,{value:false},createElement(MissionStory,{...props,vietnamese:false})));
   assert.ok(!englishOnly.includes('lang="vi"'),'Support off hides all Vietnamese story assistance');
   const variant=lesson.variants[band];
   content.push(variant.goal,...variant.questions.flatMap(q=>[q.prompt,...q.options.map(o=>o.text)]));
  }
  // Every content-bearing mission/question string must have a fixed translation.
  for(const text of new Set(content)){
   const translated=translateVietnamese(text);assert.ok(translated,`Missing Vietnamese: ${text}`);
   const on=renderToStaticMarkup(createElement(VietnameseSupport,{value:true},createElement(Bilingual,{text,learning:true})));
   const off=renderToStaticMarkup(createElement(VietnameseSupport,{value:false},createElement(Bilingual,{text,learning:true})));
   assert.ok(on.includes('lang="vi"')&&on.includes(escape(translated)));
   assert.ok(!off.includes('lang="vi"')&&off.includes(escape(text)));
   assisted++;
  }
  const bad=mission.type==='DISCOVERY'?{type:mission.type,answer:'unrelated'}:mission.type==='REASONING'?{type:mission.type,answer:'oxygen-stress',evidence:[]}:{type:mission.type,sequence:[],transfer:'looks-clear'};
  const result=evaluate(mission,bad,mission.type==='PUZZLE'?[]:mission.challenge.observations.map(o=>o.id));
  assert.ok(translateVietnamese(result.feedback),`Wrong-answer feedback translated: ${mission.id}`);
 }
 console.log(`PASS: ${assisted} mission/question translations on/off; all 12 actual story variants including lake screenshot narrative/objectives; inline reading support and English-only mode; new/returning journey. Not a browser interaction test.`);
}finally{await rm(dir,{recursive:true,force:true});}
