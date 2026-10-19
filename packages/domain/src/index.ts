export const skillStates = ['NOT_STARTED','FAMILIAR','PROFICIENT','MASTERED'] as const;
export type SkillState = typeof skillStates[number];
export type MissionId = 'silent-forest' | 'disappearing-lake' | 'restore-ecosystem';
export interface EnglishEvidence { key:string; missionId:MissionId|`travel:${string}`; attemptId:string; lessonId:string; version:number; band:'A1'|'A2'|'B1'|'B2'; skill:'reading'|'vocabulary'; itemId:string; support:{vietnamese:boolean;glossary:boolean}; recordedAt:string; }
export interface Progress { englishEvidence?:EnglishEvidence[]; completed: MissionId[]; evidence: string[]; xp:number; }
export const emptyProgress = ():Progress => ({completed:[],evidence:[],xp:0});
export function levelForXp(xp:number) { if(!Number.isFinite(xp)||xp<0) throw new Error('Invalid XP'); let level=1; while(cumulativeXp(level+1)<=xp) level++; return level; }
export const cumulativeXp = (level:number) => 50*(level-1)*level;
export function mastery(evidence:string[]):SkillState {
  const has=(s:string)=>evidence.includes(s);
  if(has('observation')&&has('causal-reasoning')&&has('recovery-transfer')&&has('delayed-transfer')) return 'MASTERED';
  if(has('observation')&&has('causal-reasoning')&&has('recovery-transfer')) return 'PROFICIENT';
  if(has('observation')) return 'FAMILIAR';
  return 'NOT_STARTED';
}
export interface UnlockRule { id:string; missions:MissionId[]; skill:SkillState; effects:string[]; }
export const unlockRules:UnlockRule[] = [
 {id:'silent-forest',missions:[],skill:'NOT_STARTED',effects:['enter-forest']},
 {id:'disappearing-lake',missions:['silent-forest'],skill:'FAMILIAR',effects:['enter-lake']},
 {id:'restore-ecosystem',missions:['silent-forest','disappearing-lake'],skill:'FAMILIAR',effects:['enter-grove']},
 {id:'observation-station',missions:['silent-forest','disappearing-lake','restore-ecosystem'],skill:'PROFICIENT',effects:['enter-station','restore-world']},
];
export function isUnlocked(id:string,p:Progress) { const rule=unlockRules.find(r=>r.id===id); return !!rule && rule.missions.every(m=>p.completed.includes(m)) && skillStates.indexOf(mastery(p.evidence))>=skillStates.indexOf(rule.skill); }
export function projection(p:Progress) { const level=levelForXp(p.xp); const activeRules=unlockRules.filter(r=>isUnlocked(r.id,p)); const effects=[...new Set(activeRules.flatMap(r=>r.effects))]; const englishEvidence=p.englishEvidence??[]; const practice=(skill:EnglishEvidence['skill'])=>({status:englishEvidence.some(e=>e.skill===skill)?'PRACTICED':'NOT_ASSESSED',items:englishEvidence.filter(e=>e.skill===skill).length}); return {...p,englishEvidence,subjectKnowledgeMastery:mastery(p.evidence),englishMastery:{reading:practice('reading'),vocabulary:practice('vocabulary'),listening:{status:'NOT_ASSESSED',items:0},pronunciation:{status:'NOT_ASSESSED',items:0},speaking:{status:'NOT_ASSESSED',items:0},cefrProficiency:null},level,nextLevelXp:cumulativeXp(level+1),levelStartXp:cumulativeXp(level),mastery:mastery(p.evidence),unlocked:activeRules.map(r=>r.id),effects,restored:effects.includes('restore-world')}; }
