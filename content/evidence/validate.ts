import type {MissionEvidence} from './types';
export function validateEvidence(e:MissionEvidence,fields:{path:string;text:string}[],today:string):string[]{
 const errors:string[]=[];const fail=(m:string)=>errors.push(`${e.missionId}: ${m}`);
 const validDate=(d:string)=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d))&&d<=today;
 const ids=<T extends {id:string}>(list:T[],name:string)=>{if(new Set(list.map(x=>x.id)).size!==list.length)fail(`duplicate ${name} ids`);};
 ids(e.sources,'source');ids(e.claims,'claim');ids(e.visuals,'visual');
 const classifications=['verified-fact','real-measurement','fictional-scenario','simulated-data','unconfirmed-hypothesis','case-inference'];
 const sources=new Map(e.sources.map(s=>[s.id,s]));const claims=new Map(e.claims.map(c=>[c.id,c]));const visuals=new Map(e.visuals.map(v=>[v.id,v]));
 if(!e.sources.length)fail('no supporting sources');
 for(const s of e.sources){
  try{const u=new URL(s.url);if(u.protocol!=='https:')fail(`source ${s.id} requires HTTPS`);if(s.authority==='government'&&!u.hostname.endsWith('.gov'))fail(`source ${s.id} authority/domain mismatch`);}catch{fail(`invalid source URL ${s.id}`);}
  if(!s.organization||!s.title||!s.verificationNote||!s.dateNote)fail(`source metadata incomplete: ${s.id}`);
  for(const d of [s.publishedAt,s.updatedAt,s.lastVerifiedAt].filter(Boolean) as string[])if(!validDate(d))fail(`invalid/future date for ${s.id}`);
  if(!s.lastVerifiedAt)fail(`source ${s.id} not verified`);
 }
 const refs=(list:{sourceId:string;locator:string}[],owner:string)=>{for(const r of list)if(!sources.has(r.sourceId)||!r.locator.trim())fail(`unresolved/unspecific citation in ${owner}`);};
 for(const c of e.claims){
  if(!classifications.includes(c.classification))fail(`unknown evidence class: ${c.id}`);
  refs(c.citations,c.id);
  if(c.classification==='verified-fact'&&!c.citations.some(r=>r.relationship==='supports'))fail(`factual claim has no supporting reference: ${c.id}`);
  if(['simulated-data','fictional-scenario','unconfirmed-hypothesis','case-inference'].includes(c.classification)&&!c.provenance)fail(`missing scenario origin: ${c.id}`);
  if(c.classification==='real-measurement'&&(!c.realMeasurement||Object.values(c.realMeasurement).some(v=>!v)||!c.citations.length))fail(`real measurement has no dataset/time/method: ${c.id}`);
  if(c.classification==='real-measurement'&&c.realMeasurement&&!/^https:\/\//.test(c.realMeasurement.datasetUrl))fail(`invalid dataset URL: ${c.id}`);
  if(c.classification==='simulated-data'&&c.realMeasurement)fail(`simulation mislabeled with real provenance: ${c.id}`);
  for(const b of ['A1','A2','B1','B2'] as const)if(!c.explanation[b]?.en||!c.explanation[b]?.vi)fail(`missing ${b} bilingual explanation for ${c.id}`);
  for(const id of c.visualIds)if(!visuals.has(id))fail(`unresolved visual ${id}`);
 }
 for(const v of e.visuals){
  refs(v.citations,v.id);
  if(!v.claimIds.length||v.claimIds.some(id=>!claims.has(id)))fail(`visual ${v.id} has no resolved learning claims`);
  if(!v.citations.length)fail(`visual ${v.id} has no science attribution`);
  if(!v.alt.en||!v.alt.vi||!v.caption.en||!v.caption.vi)fail(`visual ${v.id} missing accessible/bilingual description`);
  if(!v.src.startsWith('/evidence/')&&!v.src.startsWith('https://'))fail(`unsafe visual path ${v.id}`);
  for(const [key,value] of Object.entries(v.attribution))if(!value)fail(`missing ${key} attribution for ${v.id}`);
  if(!/^https:\/\//.test(v.attribution.licenseUrl))fail(`invalid visual license URL: ${v.id}`);
  if(!v.attribution.sourceUrl.startsWith('/evidence/')&&!v.attribution.sourceUrl.startsWith('https://'))fail(`invalid visual origin: ${v.id}`);
  if(v.role==='real-observation'&&!v.claimIds.some(id=>claims.get(id)?.classification==='real-measurement'))fail(`visual ${v.id} implies unsupported real observation`);
  if(v.role==='simulated-comparison'&&!v.claimIds.some(id=>claims.get(id)?.classification==='simulated-data'))fail(`unlabeled simulated visual ${v.id}`);
 }
 for(const v of e.vocabulary)if(!v.claimIds.length||v.claimIds.some(id=>!claims.has(id)))fail(`uncited vocabulary: ${v.word}`);
 const coverage=new Map(e.coverage.map(c=>[c.path,c]));if(coverage.size!==e.coverage.length)fail('duplicate coverage paths');
 for(const f of fields){const c=coverage.get(f.path);if(!c){fail(`unaudited learning field: ${f.path}`);continue;}
  if(!classifications.includes(c.classification))fail(`unknown coverage class: ${f.path}`);
  if(c.text!==f.text)fail(`learning field changed since citation audit: ${f.path}`);
  if(c.claimIds.some(id=>!claims.has(id)))fail(`unresolved claim coverage: ${f.path}`);
  if(c.classification==='verified-fact'&&!c.claimIds.some(id=>claims.get(id)?.classification==='verified-fact'&&claims.get(id)?.citations.some(r=>r.relationship==='supports')))fail(`uncited factual field: ${f.path}`);
 }
 for(const c of e.coverage)if(!fields.some(f=>f.path===c.path))fail(`stale coverage path: ${c.path}`);
 return errors;
}
