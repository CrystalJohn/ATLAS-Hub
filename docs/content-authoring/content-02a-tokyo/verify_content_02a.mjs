import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const json = async (name) => JSON.parse((await readFile(join(root, name), "utf8")).replace(/^\uFEFF/, ""));
const scenarios = await json("TOKYO-scenarios.json");
const candidates = await json("TOKYO-tower-candidates.json");
const keys = await json("TOKYO-tower-keys.private.json");
const objectives = new Set(["O-LOCATE","O-ROUTE","O-INFO","O-SHOP","O-FOOD","O-REPAIR"]);
assert.equal(scenarios.length, 12, "expected 12 scenario records");
assert.equal(new Set(scenarios.map(x => x.id)).size, scenarios.length, "duplicate scenario ID");
const lessonMap = new Map();
const sourceIds = new Set();
for (const s of scenarios) {
  assert.equal(s.status, "DRAFT", s.id + " must remain DRAFT");
  assert.equal(s.contentRevision, "TOKYO-DAILY-r1", s.id + " revision mismatch");
  assert.deepEqual(s.reviewStatus, {en:"PENDING",vi:"PENDING",cultural:"PENDING",assessment:"PENDING",educator:"PENDING"});
  assert.ok(s.objectiveIds.length && s.objectiveIds.every(id => objectives.has(id)), s.id + " has an unknown objective");
  assert.ok(s.vocabularyIds.length && s.vocabularyIds.every(id => id?.startsWith("VS-")), s.id + " has unresolved vocabulary IDs");
  assert.ok(s.chunkIds.length && s.chunkIds.every(id => id?.startsWith("CH-")), s.id + " has unresolved chunk IDs");
  s.sourceIds.forEach(id => sourceIds.add(id));
  assert.notEqual(s.base.en, s.retry.en, s.id + " retry must vary meaningfully");
  assert.equal(s.retryFamilyId, "RF-" + s.id);
  assert.ok(Array.isArray(s.playerInteractionPlan) && s.playerInteractionPlan.length >= 2, s.id + " needs concrete interaction steps");
  assert.ok(s.playerInteractionPlan.every(step => step.promptEn && step.promptVi && step.playerAction && step.evidence && step.scoringStatus === "DESIGN_PENDING"), s.id + " interaction plan incomplete or prematurely scored");
  assert.equal(s.sourceLessonRefs.length, 2);
  for (const lesson of [s.base, s.retry]) {
    const ref = s.sourceLessonRefs.find(x => x.lessonId === lesson.id);
    assert.ok(ref, lesson.id + " is not pinned");
    assert.equal(ref.revision, s.contentRevision);
    const digest = createHash("sha256").update(lesson.en + "\n--VI--\n" + lesson.vi, "utf8").digest("hex");
    assert.equal(ref.sha256, digest, lesson.id + " hash mismatch");
    assert.ok(!lessonMap.has(lesson.id), "duplicate lesson ID " + lesson.id);
    lessonMap.set(lesson.id, { scenario:s, lesson, ref });
  }
}
assert.equal(lessonMap.size, 24);
const vocabularyDoc = await readFile(join(root, "TOKYO-vocabulary-and-chunks.md"), "utf8");
const idCells = vocabularyDoc.split(/\r?\n/).map(line => line.split("|")[1]?.trim());
const registeredVocabulary = new Set(idCells.filter(id => id?.startsWith("VS-")));
const registeredChunks = new Set(idCells.filter(id => id?.startsWith("CH-")));
assert.ok([...scenarios.flatMap(s => s.vocabularyIds)].every(id => registeredVocabulary.has(id)), "scenario vocabulary ID missing from sense registry");
assert.ok([...scenarios.flatMap(s => s.chunkIds)].every(id => registeredChunks.has(id)), "scenario chunk ID missing from chunk registry");const sourceDoc = await readFile(join(root, "TOKYO-source-register.md"), "utf8");
const knownSources = new Set([...sourceDoc.matchAll(/^\|\s*(S-[A-Z]+)\s*\|/gm)].map(m => m[1]));
assert.ok([...sourceIds].every(id => knownSources.has(id)), "unresolved source IDs: " + [...sourceIds].filter(id => !knownSources.has(id)).join(", "));

assert.equal(candidates.length, 10, "expected 10 candidate families");
assert.equal(new Set(candidates.map(x => x.id)).size, candidates.length, "duplicate candidate ID");
assert.equal(keys.length, 20, "expected 20 private keys");
const keyMap = new Map(keys.map(x => [x.variantId, x]));
assert.equal(keyMap.size, keys.length, "duplicate private key");
const variantIds = new Set();
let variantCount = 0;
for (const candidate of candidates) {
  assert.equal(candidate.status, "DRAFT");
  assert.equal(candidate.contentRevision, "TOKYO-DAILY-r1");
  assert.ok(objectives.has(candidate.objectiveId));
  const scenario = scenarios.find(x => x.id === candidate.scenarioId);
  assert.ok(scenario, candidate.id + " source scenario missing");
  assert.ok(scenario.objectiveIds.includes(candidate.objectiveId), candidate.id + " objective not in source scenario");
  assert.equal(candidate.retryFamilyId, scenario.retryFamilyId);
  assert.ok(candidate.vocabularyIds.every(id => scenario.vocabularyIds.includes(id)), candidate.id + " vocabulary not taught in scenario");
  assert.ok(candidate.chunkIds.every(id => scenario.chunkIds.includes(id)), candidate.id + " chunk not taught in scenario");
  assert.deepEqual(candidate.reviewStatus, {en:"PENDING",vi:"PENDING",distractor:"PENDING",educator:"PENDING"});
  assert.equal(candidate.variants.length, 2);
  for (const v of candidate.variants) {
    variantCount++;
    assert.ok(!variantIds.has(v.id), "duplicate variant ID " + v.id);
    variantIds.add(v.id);
    const source = lessonMap.get(v.sourceLessonId);
    assert.ok(source, v.id + " source lesson missing");
    assert.equal(source.scenario.id, candidate.scenarioId);
    assert.equal(v.sourceLessonRevision, source.ref.revision);
    assert.equal(v.sourceLessonSha256, source.ref.sha256);
    const optionIds = v.options.map(o => o.id);
    assert.equal(optionIds.length, 3);
    assert.equal(new Set(optionIds).size, 3);
    assert.ok(v.options.every(o => o.text));
    assert.ok(!("correctOptionId" in v) && !("answerKey" in v), v.id + " leaks answer key");
    const key = keyMap.get(v.id);
    assert.ok(key, v.id + " has no private key");
    assert.ok(optionIds.includes(key.correctOptionId), v.id + " answer key points to missing option");
    assert.deepEqual(new Set(Object.keys(key.distractorRationale)), new Set(optionIds.filter(id => id !== key.correctOptionId)), v.id + " lacks a rationale for a distractor");
    assert.ok(key.correctRationaleEn && key.correctRationaleVi, v.id + " lacks bilingual correct feedback");
  }
}
assert.equal(variantCount, 20);
assert.deepEqual(new Set(keyMap.keys()), variantIds, "orphan or missing private keys");
for (const name of ["TOKYO-learning-objectives.md","TOKYO-scenarios.md","TOKYO-vocabulary-and-chunks.md","TOKYO-tower-candidates.md","TOKYO-listening-scripts.md","TOKYO-assets.md","TOKYO-editorial-matrix.md","CONTENT-02A-architecture-review.md","CONTENT-02A-final-report.md"]) {
  await readFile(join(root, name));
}
const publicText = await readFile(join(root, "TOKYO-tower-candidates.json"), "utf8");
assert.ok(!/"correctOptionId"\s*:/.test(publicText), "public draft contains keyed answers");
const assets = await readFile(join(root, "TOKYO-assets.md"), "utf8");
assert.ok(assets.includes("No asset was downloaded, edited or integrated."));
const audio = await readFile(join(root, "TOKYO-listening-scripts.md"), "utf8");
assert.ok(audio.includes("Script lock | false") && audio.includes("NOT GENERATED"));
assert.ok(!/"status"\s*:\s*"(APPROVED|PUBLISHED)"/.test(publicText));

console.log("PASS — " + scenarios.length + " scenarios, " + lessonMap.size + " hashed source lessons, " + candidates.length + " Tower candidate families, " + variantCount + " question variants, " + keys.length + " private keys.");
console.log("PASS — IDs, objective/source/vocabulary/chunk links, retries, hashes, private-key separation, bilingual feedback, DRAFT gates and audio/asset boundaries.");


