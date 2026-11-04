import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
const root=path.dirname(fileURLToPath(import.meta.url)),src=path.resolve(root,"../content-02a-tokyo");
const hash=t=>crypto.createHash("sha256").update(t).digest("hex");
const j=n=>JSON.parse(fs.readFileSync(path.join(root,n),"utf8").replace(/^\uFEFF/,""));
const snap=j("CONTENT-02B-source-snapshot.json");
for(const [n,h] of Object.entries(snap))assert.equal(hash(fs.readFileSync(path.join(src,n))),h,"02A source changed: "+n);
execFileSync(process.execPath,[path.join(src,"verify_content_02a.mjs")],{stdio:"inherit"});
const s=j("TOKYO-scenarios.r2.json"),c=j("TOKYO-tower-candidates.r2.json"),keys=j("TOKYO-tower-keys.r2.private.json"),manifest=j("CONTENT-02B-script-lock-manifest.json"),matrix=j("CONTENT-02B-item-review-matrix.json");
assert.equal(s.length,12);assert.equal(c.length,10);assert.equal(keys.length,20);
const lessons=new Map();
for(const item of s){
 assert.equal(item.contentRevision,"TOKYO-DAILY-r2");
 assert.equal(item.status,"DRAFT");assert.equal(item.aiReview.independentHumanSignoff,null);
 assert.equal(item.retryFamilyId,"RF-"+item.id);
 for(const l of [item.base,item.retry]){
  const ref=item.sourceLessonRefs.find(r=>r.lessonId===l.id);
  assert.equal(ref.sha256,hash(l.en+"\n--VI--\n"+l.vi));assert.equal(ref.revision,item.contentRevision);
  assert(!lessons.has(l.id));lessons.set(l.id,{item,l,ref});
 }
}
const keyMap=new Map(keys.map(k=>[k.variantId,k])),ids=new Set();
for(const candidate of c){
 const scenario=s.find(x=>x.id===candidate.scenarioId);
 assert(scenario.objectiveIds.includes(candidate.objectiveId));
 assert(candidate.vocabularyIds.every(id=>scenario.vocabularyIds.includes(id)));
 assert(candidate.chunkIds.every(id=>scenario.chunkIds.includes(id)));
 assert.equal(candidate.contentRevision,"TOKYO-DAILY-r2");
 assert.equal(candidate.retryFamilyId,scenario.retryFamilyId);
 assert.notEqual(candidate.evidenceType,"RECALL");
 for(const v of candidate.variants){
  assert(!ids.has(v.id));ids.add(v.id);
  const source=lessons.get(v.sourceLessonId);assert.equal(source.item.id,candidate.scenarioId);
  assert.equal(source.ref.sha256,v.sourceLessonSha256);assert.equal(source.ref.revision,v.sourceLessonRevision);
  const k=keyMap.get(v.id);assert(k);assert(v.options.some(o=>o.id===k.correctOptionId));
  assert.deepEqual(Object.keys(k.distractorRationale).sort(),v.options.map(o=>o.id).filter(id=>id!==k.correctOptionId).sort());
  assert(!JSON.stringify(v).includes("correctOptionId"));
 }
}
assert.equal(ids.size,20);
assert.equal(manifest.scripts.length,6);
for(const script of manifest.scripts){
 assert.equal(script.version,2);
 assert.equal(script.hash,hash(JSON.stringify({scriptId:script.scriptId,version:script.version,turns:script.turns})));
 assert.equal(script.transcript,script.turns.map(t=>t.speakerRole+": "+t.text).join("\n"));
 assert.equal(script.status,"READY_FOR_HUMAN_SCRIPT_LOCK");assert.equal(script.scriptLock,false);
 assert.equal(script.independentHumanReview,null);assert.equal(script.generatedAsset,null);
 assert(lessons.has(script.sourceLessonRef.lessonId));
 assert.equal(script.sourceLessonRef.sha256,lessons.get(script.sourceLessonRef.lessonId).ref.sha256);
}
assert.equal(new Set(matrix.map(x=>x.id)).size,matrix.length,"duplicate review unit ID");
assert(matrix.every(x=>["ACCEPT","ACCEPT_WITH_MINOR_EDITS","REVISE","BLOCK"].includes(x.disp)));
for(const candidate of c)for(const v of candidate.variants)for(const o of v.options)assert(matrix.some(x=>x.id===v.id+"."+o.id));
for(const name of ["editorial-review.md","item-review-matrix.md","tower-review.md","listening-review.md","script-lock-manifest.json","elevenlabs-production-plan.md","architecture-verdict.md","final-report.md"])assert(fs.existsSync(path.join(root,"CONTENT-02B-"+name)),name);
// Negative oracles prove role-sensitive hashes reject changed text/order.
const first=manifest.scripts[0],payload={scriptId:first.scriptId,version:first.version,turns:first.turns};
assert.notEqual(first.hash,hash(JSON.stringify({...payload,turns:[...first.turns].reverse()})));
assert.notEqual(first.hash,hash(JSON.stringify({...payload,turns:first.turns.map((t,i)=>i? t : {...t,text:t.text+" changed"})})));
console.log("PASS 02B: 02A unchanged; 12 r2 scenarios / 24 lesson digests; 20 variant dependencies and private keys; "+matrix.length+" matrix units; 6 v2 role-sensitive script hashes; no human lock or audio.");
console.log("PASS negative oracles: edited script text and reordered role turns invalidate hash. Semantic validity/human approval NOT established.");
