import type {PlayerTravelProgress} from '../../content/travel/types';
import type {projection} from '../../packages/domain/src/index';
import type {publicMission} from '../../content/missions/index';
import type {evaluateEnglishItem} from '../../packages/english-engine/src/chapter';
export type Mission=ReturnType<typeof publicMission>;
export type Attempt={id:string;missionId:string;version:number;observed:string[];status:string;createdAt:string};
export type AtlasState=ReturnType<typeof projection>&{travel?:PlayerTravelProgress;missions:Mission[];attempts:Attempt[];englishReview:{lessonId:string;band:string;itemId:string;correct:boolean}[];ledger:{id:string;missionId:string;amount:number;contentVersion:number;createdAt:string}[]};
export type EnglishResult=ReturnType<typeof evaluateEnglishItem>&{newEvidence:number;state:AtlasState};
export type SubjectResult={correct:boolean;feedback:string;awardedXp:number;state:AtlasState};
export class AtlasApiError extends Error { status:number;code?:string;constructor(status:number,message:string,code?:string){super(message);this.status=status;this.code=code;} }
export async function atlasApi<T=AtlasState>(path:string,data?:unknown):Promise<T>{
 const response=await fetch(`/api/${path}`,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),...(data===undefined?{}:{body:JSON.stringify(data)})});
 const body=await response.json() as T&{message?:string;code?:string};if(!response.ok){if(response.status===401&&typeof window!=='undefined')window.dispatchEvent(new Event('atlas:sign-in-required'));throw new AtlasApiError(response.status,body.message??'We could not save that action. Please try again.',body.code);}return body;
}
