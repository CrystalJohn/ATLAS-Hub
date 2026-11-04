export const STUDY_TIME_ZONE='Asia/Ho_Chi_Minh';
export type StudyHistory={version:1;timeZone:typeof STUDY_TIME_ZONE;days:string[]};
export type StudySummary=StudyHistory&{today:string;currentStreak:number;longestStreak:number;totalDays:number;studiedToday:boolean;lastStudyDay:string|null};
const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:STUDY_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'});
export function studyDate(now:Date):string{
 if(!Number.isFinite(now.getTime()))throw new Error('Invalid study clock');
 const parts=formatter.formatToParts(now),value=(type:string)=>parts.find(p=>p.type===type)!.value;
 return value('year')+'-'+value('month')+'-'+value('day');
}
export function validStudyDate(value:unknown):value is string{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+'T00:00:00.000Z');
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export const dayNumber=(day:string)=>Date.parse(day+'T00:00:00Z')/86400000;
export function normalizeStudyDays(days:unknown):string[]{return Array.isArray(days)?[...new Set(days.filter(validStudyDate))].sort():[];}
export function summarizeStudy(days:unknown,now:Date=new Date()):StudySummary{
 const today=studyDate(now),history=normalizeStudyDays(days).filter(d=>d<=today);
 let longest=0,run=0,previous:number|undefined;
 for(const day of history){const n=dayNumber(day);run=previous!==undefined&&n===previous+1?run+1:1;longest=Math.max(longest,run);previous=n;}
 const last=history.at(-1)??null,lastNumber=last?dayNumber(last):null;
 return {version:1,timeZone:STUDY_TIME_ZONE,days:history,today,currentStreak:lastNumber!==null&&dayNumber(today)-lastNumber<=1?run:0,longestStreak:longest,totalDays:history.length,studiedToday:last===today,lastStudyDay:last};
}
