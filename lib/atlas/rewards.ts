import type {Expedition} from './service.ts';
/** Shared existing first-clear ledger writer; caller commits it with the full expedition. */
export function awardFirstClear(d:Expedition,missionId:string,version:number,amount:number){
 if(d.ledger.some(e=>e.missionId===missionId&&e.contentVersion===version))return 0;
 d.progress.xp+=amount;d.ledger.push({id:crypto.randomUUID(),missionId,contentVersion:version,amount,createdAt:new Date().toISOString()});return amount;
}
