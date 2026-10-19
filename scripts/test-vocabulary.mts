import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {handleAtlas} from '../lib/atlas/service.ts';
import {chapterLessons} from '../content/english/chapter.ts';
import {pronunciations} from '../content/english/pronunciation.ts';
for(const lesson of chapterLessons)for(const entry of lesson.glossary){const ipa=pronunciations[entry.word];assert.ok(ipa?.us&&ipa?.uk&&ipa.sourceUrl.startsWith('https://dictionary.cambridge.org/'));assert.equal(ipa.verifiedAt,'2026-10-19');}
const require=createRequire(import.meta.resolve('wrangler'));const {Miniflare}=require('miniflare');
const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("test")}}',compatibilityDate:'2026-05-15',d1Databases:['DB']});
try{
 const db=await mf.getD1Database('DB');await db.prepare(await readFile(new URL('../drizzle/0000_parallel_guardian.sql',import.meta.url),'utf8')).run();
 const call=async(path:string,body?:unknown,player='word-player',origin='https://atlas.test')=>{const r=await handleAtlas(new Request(`https://atlas.test/api/${path}`,{method:body===undefined?'GET':'POST',headers:{'oai-authenticated-user-id':player,origin,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})}),db);return {status:r.status,body:await r.json() as any};};
 const word={lessonId:'forest-field-note',version:1,word:'canopy',saved:true};
 const before=(await call('session',{})).body;
 assert.deepEqual((await call('vocabulary')).body.words,[],'Old documents without the new property remain readable');
 assert.equal((await call('vocabulary',word,'')).status,401);
 assert.equal((await call('vocabulary',word,'word-player','https://evil.test')).status,403);
 for(const mutation of [{word:'invented'},{version:2},{xp:500},{meaning:'client-controlled'},{lessonId:'missing'}])assert.equal((await call('vocabulary',{...word,...mutation})).status,400);
 assert.equal((await call('vocabulary',{...word,lessonId:'lake-field-note',word:'measurement'})).status,403);
 const many=await Promise.all(Array.from({length:8},()=>call('vocabulary',word)));assert.ok(many.every(r=>r.status===201));
 let words=(await call('vocabulary')).body.words;assert.equal(words.length,1);assert.ok(!Number.isNaN(Date.parse(words[0].savedAt)));
 const firstSavedAt=words[0].savedAt;await call('vocabulary',word);assert.equal((await call('vocabulary')).body.words[0].savedAt,firstSavedAt);
 assert.deepEqual((await call('state')).body,before,'Saving words never changes progress or mastery');
 assert.deepEqual((await call('vocabulary',undefined,'other-player')).body.words,[]);
 await call('session',{});assert.equal((await call('vocabulary')).body.words[0].word,'canopy','Reload retains account collection');
 await call('vocabulary',{...word,saved:false});await call('vocabulary',{...word,saved:false});assert.deepEqual((await call('vocabulary')).body.words,[]);
 const attempt=(await call('attempts',{missionId:'silent-forest'})).body;
 for(const clueId of ['canopy','stream','wildlife'])await call(`attempts/${attempt.id}/observe`,{clueId});
 const [reward,saved]=await Promise.all([call(`attempts/${attempt.id}/submit`,{type:'DISCOVERY',answer:'linked'}),call('vocabulary',word)]);
 assert.equal(reward.body.awardedXp,30);assert.equal(saved.status,201);
 assert.equal((await call('state')).body.xp,30);assert.equal((await call('state')).body.ledger.length,1);assert.equal((await call('vocabulary')).body.words.length,1);
 console.log('PASS: 12 glossary IPA records; actual D1 saved vocabulary auth/origin/strict catalog validation; old documents; duplicate and concurrent saves; remove/reload; account isolation; concurrent reward integrity.');
}finally{await mf.dispose();}
