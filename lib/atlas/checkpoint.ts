import {z} from 'zod';
import {encounterFor,travelPacks} from '../../content/travel/japan.ts';
import {emptyTravel,type PlayerTravelProgress} from '../../content/travel/types.ts';
import {missionById} from '../../content/missions/index.ts';
import {isUnlocked,type Progress} from '../../packages/domain/src/index.ts';
import {travelUnlocked} from '../../packages/mission-engine/src/travel.ts';
import {travelRules} from './travel-rules.ts';

export type AdventurePhase='brief'|'explore'|'english'|'subject';
export type ResumeTarget=
 | {kind:'travel';countryId:string;destinationId:string;encounterId:string;contentVersion:number;step:number;stepId:string;routeIndex:number;replay:boolean}
 | {kind:'nature';missionId:string;attemptId:string;contentVersion:number;phase:AdventurePhase;observed:string[];replay:boolean};
export type ResumeState={schemaVersion:1;revision:number;target:ResumeTarget|null;recovered:boolean;reason:'SAVED'|'LEGACY_RECOVERED'|'INVALID_CHECKPOINT'|'CONTENT_CHANGED'|'NONE'};
type AttemptRef={id:string;missionId:string;version:number;observed:string[];status:string;createdAt:string;lastActivityRevision?:number};
export type CheckpointDocument={progress:Progress;attempts:AttemptRef[];travel?:PlayerTravelProgress;checkpoint?:unknown};
const targetInput=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('travel'),encounterId:z.string().min(1).max(80)}).strict(),
 z.object({kind:z.literal('nature'),attemptId:z.string().uuid(),phase:z.enum(['brief','explore','english','subject'])}).strict(),
]);
export const checkpointInput=z.object({expectedRevision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1),target:targetInput}).strict();
const savedCheckpoint=z.object({schemaVersion:z.literal(1),savedRevision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),updatedAt:z.string().datetime(),contentVersion:z.number().int().positive(),target:targetInput}).strict();
export type CheckpointTarget=z.infer<typeof targetInput>;

/** Checkpoint pointers never carry an XP amount, completion flag, or client step. */
export function resolveTarget(d:CheckpointDocument,target:CheckpointTarget):ResumeTarget|null{
 if(target.kind==='travel'){
  const found=encounterFor(target.encounterId),travel=d.travel??emptyTravel();
  if(!found||found.pack.country.availability!=='PLAYABLE'||!travelUnlocked(target.encounterId,travel))return null;
  const p=travel.encounters[target.encounterId];
  if(!p||!Number.isInteger(p.step)||p.step<0||p.step>=found.encounter.steps.length||!Number.isInteger(p.routeIndex)||p.routeIndex<0)return null;
  const step=found.encounter.steps[p.step];
  if(step.kind==='route'&&(p.routeIndex>=(travelRules[found.encounter.id]?.[step.id]?.route?.length??0)||p.position&&(p.position[0]<0||p.position[1]<0||p.position[0]>=step.grid.width||p.position[1]>=step.grid.height)))return null;
  return {kind:'travel',countryId:found.pack.country.id,destinationId:found.encounter.destinationId,encounterId:found.encounter.id,contentVersion:found.encounter.version,step:p.step,stepId:step.id,routeIndex:p.routeIndex,replay:!!p.completedAt};
 }
 const a=d.attempts.find(a=>a.id===target.attemptId);
 if(!a||!isUnlocked(a.missionId,d.progress)||!['ACTIVE','COMPLETED'].includes(a.status))return null;
 try{
  const m=missionById(a.missionId,a.version);
  if(m.type==='PUZZLE'&&target.phase==='explore')return null;
  if(m.type!=='PUZZLE'&&a.observed.some(id=>!m.challenge.observations.some(c=>c.id===id)))return null;
  if(a.status==='COMPLETED'&&target.phase!=='english')return null;
  const allClues=m.type==='PUZZLE'||m.challenge.observations.every(c=>a.observed.includes(c.id));
  if(['english','subject'].includes(target.phase)&&!allClues)return null;
  return {kind:'nature',missionId:m.id,attemptId:a.id,contentVersion:m.version,phase:target.phase,observed:[...a.observed],replay:d.progress.completed.includes(m.id)};
 }catch{return null;}
}

export function saveCheckpoint(d:CheckpointDocument,target:CheckpointTarget,revision:number){
 const resolved=resolveTarget(d,target);
 if(!resolved)return false;
 if(target.kind==='travel')d.travel!.encounters[target.encounterId].lastActivityRevision=revision;
 else d.attempts.find(a=>a.id===target.attemptId)!.lastActivityRevision=revision;
 d.checkpoint={schemaVersion:1,savedRevision:revision,updatedAt:new Date().toISOString(),contentVersion:resolved.contentVersion,target};
 return true;
}

/** Reconstruct cursors from authoritative progress; never restore old progress over it. */
export function resumeFor(d:CheckpointDocument,revision:number):ResumeState{
 const base={schemaVersion:1 as const,revision,target:null,recovered:false,reason:'NONE' as ResumeState['reason']};
 const parsed=savedCheckpoint.safeParse(d.checkpoint);
 if(parsed.success){
  const resolved=resolveTarget(d,parsed.data.target);
  if(resolved&&parsed.data.savedRevision<=revision){
   if(resolved.contentVersion!==parsed.data.contentVersion)return {...base,recovered:true,reason:'CONTENT_CHANGED'};
   return {...base,target:resolved,reason:'SAVED'};
  }
 }
 // When the latest adventure finishes, recover another unfinished one by its
 // server commit revision, without depending on worker clocks/browser storage.
 const invalid=d.checkpoint!==undefined&&d.checkpoint!==null;
 const reason=invalid?'INVALID_CHECKPOINT':d.checkpoint===undefined?'LEGACY_RECOVERED':'SAVED';
 const candidates:{target:ResumeTarget;revision:number;createdAt:string}[]=[];
 const activityRevision=(value:number|undefined)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0&&value<=revision?value:0;
 for(const a of d.attempts){
  if(a.status!=='ACTIVE')continue;
  const target=resolveTarget(d,{kind:'nature',attemptId:a.id,phase:a.observed.length?'explore':'brief'});
  if(target)candidates.push({target,revision:activityRevision(a.lastActivityRevision),createdAt:a.createdAt});
 }
 for(const pack of travelPacks)for(const e of pack.encounters){
  const target=resolveTarget(d,{kind:'travel',encounterId:e.id});
  if(target)candidates.push({target,revision:activityRevision(d.travel!.encounters[e.id].lastActivityRevision),createdAt:''});
 }
 const latest=candidates.sort((a,b)=>b.revision-a.revision||b.createdAt.localeCompare(a.createdAt))[0];
 if(latest)return {...base,target:latest.target,recovered:reason!=='SAVED',reason};
 return {...base,recovered:invalid,reason:invalid?'INVALID_CHECKPOINT':'NONE'};
}
