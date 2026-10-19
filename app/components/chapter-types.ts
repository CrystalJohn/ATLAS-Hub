import type {PlayerTravelProgress} from '../../content/travel/types';
import type {projection} from '../../packages/domain/src/index';
import type {publicMission} from '../../content/missions/index';
import type {evaluateEnglishItem} from '../../packages/english-engine/src/chapter';
export type Mission=ReturnType<typeof publicMission>;
export type Attempt={id:string;missionId:string;version:number;observed:string[];status:string;createdAt:string};
export type AtlasState=ReturnType<typeof projection>&{travel?:PlayerTravelProgress;missions:Mission[];attempts:Attempt[];englishReview:{lessonId:string;band:string;itemId:string;correct:boolean}[];ledger:{id:string;missionId:string;amount:number;contentVersion:number;createdAt:string}[]};
export type EnglishResult=ReturnType<typeof evaluateEnglishItem>&{newEvidence:number;state:AtlasState};
export type SubjectResult={correct:boolean;feedback:string;awardedXp:number;state:AtlasState};
export async function atlasApi<T=AtlasState>(path:string,data?:unknown):Promise<T>{
 const response=await fetch(`/api/${path}`,{method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),...(data===undefined?{}:{body:JSON.stringify(data)})});
 const body=await response.json() as T&{message?:string};if(!response.ok)throw new Error(body.message??'We could not save that action. Please try again.');return body;
}
