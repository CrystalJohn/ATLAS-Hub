import {STUDY_TIME_ZONE,normalizeStudyDays,studyDate,summarizeStudy,type StudyHistory} from '../../packages/domain/src/study.ts';
import type {Expedition} from './service.ts';

/** Recover only timestamps attached to actual saved learning; a login/attempt start is not learning. */
export function recordedStudyDays(d:Expedition):string[]{
 const days=[...(d.studyHistory?.days??[])];
 const add=(value:unknown)=>{
  if(typeof value!=='string'||!/\dT/.test(value))return;
  const date=new Date(value);if(Number.isFinite(date.getTime()))days.push(studyDate(date));
 };
 for(const raw of d.submissions){
  const e=raw as {studyEligible?:boolean;createdAt?:unknown;payload?:{type?:string}};
  if(e.studyEligible!==false&&['ENGLISH_ITEM','ENGLISH','DISCOVERY','REASONING','PUZZLE'].includes(e.payload?.type??''))add(e.createdAt);
 }
 for(const e of d.progress.englishEvidence??[])add(e.recordedAt);
 for(const e of Object.values(d.travel?.encounters??{}))add(e.completedAt);
 // An immutable first-clear ledger proves an actual completed learning activity.
 for(const e of d.ledger)add(e.createdAt);
 return normalizeStudyDays(days);
}
export function studyFor(d:Expedition,now:Date=new Date()){return summarizeStudy(recordedStudyDays(d),now);}
export function recordStudy(d:Expedition,now:Date):void{
 const history:StudyHistory={version:1,timeZone:STUDY_TIME_ZONE,days:normalizeStudyDays([...recordedStudyDays(d),studyDate(now)])};
 d.studyHistory=history;
}
