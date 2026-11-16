import assert from 'node:assert/strict';
import {chapterLessons} from '../content/english/chapter.ts';
import {pronunciations} from '../content/english/pronunciation.ts';
import {travelVocabularyLessons} from '../content/travel/japan.ts';
let entries=0;
for(const lesson of chapterLessons)for(const entry of lesson.glossary){
 const ipa=pronunciations[entry.word];
 assert.ok(ipa?.us&&ipa?.uk&&ipa.sourceUrl.startsWith('https://dictionary.cambridge.org/'));
 assert.equal(ipa.verifiedAt,'2026-10-19');entries++;
}
for(const lesson of travelVocabularyLessons)for(const entry of lesson.glossary){
 assert.ok(entry.word&&entry.meaning&&entry.example&&entry.exampleVi);entries++;
}
console.log(`PASS vocabulary content: ${entries} glossary records with IPA provenance and bilingual examples.`);
