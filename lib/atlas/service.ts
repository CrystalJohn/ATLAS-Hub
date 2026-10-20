import {z} from 'zod';
import {emptyTravel,type PlayerTravelProgress} from '../../content/travel/types.ts';
import {packFor,travelVocabularyLessons,encounterFor} from '../../content/travel/japan.ts';
import {TravelSubmission,evaluateTravel,travelUnlocked} from '../../packages/mission-engine/src/travel.ts';
import {lessonById} from '../../content/english/chapter.ts';
import {EnglishItemSchema,evaluateEnglishItem} from '../../packages/english-engine/src/chapter.ts';
import {emptyProgress,isUnlocked,projection,type Progress,type EnglishEvidence} from '../../packages/domain/src/index.ts';
import {missionById,missions,publicMission} from '../../content/missions/index.ts';
import {evaluate,SubmissionSchema} from '../../packages/mission-engine/src/index.ts';
import {forestLesson} from '../../content/english/forest.ts';
import {EnglishSubmissionSchema,evaluateEnglish} from '../../packages/english-engine/src/index.ts';
import type {SavedWord} from '../../content/english/vocabulary.ts';
import {d1ExpeditionStore,StorageUnavailable,type ExpeditionStore} from './storage.ts';
import {sameOrigin} from './origin.ts';
type Attempt={id:string;missionId:string;version:number;observed:string[];status:string;createdAt:string};
type Ledger={id:string;missionId:string;contentVersion:number;amount:number;createdAt:string};
type Expedition={progress:Progress;attempts:Attempt[];ledger:Ledger[];submissions:unknown[];savedVocabulary?:SavedWord[];travel?:PlayerTravelProgress};
class ApiError extends Error{status:number;constructor(status:number,message:string){super(message);this.status=status;}}
const uid=()=>crypto.randomUUID();
const fresh=():Expedition=>({progress:emptyProgress(),attempts:[],ledger:[],submissions:[]});
function awardFirstClear(d:Expedition,missionId:string,version:number,amount:number){
 if(d.ledger.some(e=>e.missionId===missionId&&e.contentVersion===version))return 0;
 d.progress.xp+=amount;d.ledger.push({id:uid(),missionId,contentVersion:version,amount,createdAt:new Date().toISOString()});return amount;
}
function view(d:Expedition){
 const review=new Map<string,{lessonId:string;band:string;itemId:string;correct:boolean}>();
 for(const raw of d.submissions){const entry=raw as {payload?:{type?:string;lessonId:string;band:string;itemId:string};correct?:boolean;items?:{itemId:string;correct:boolean}[]};const p=entry.payload;if(!p)continue;
  if(p.type==='ENGLISH_ITEM')review.set(`${p.lessonId}:${p.band}:${p.itemId}`,{lessonId:p.lessonId,band:p.band,itemId:p.itemId,correct:entry.correct===true});
  if(p.type==='ENGLISH')for(const i of entry.items??[])review.set(`${p.lessonId}:${p.band}:${i.itemId}`,{lessonId:p.lessonId,band:p.band,itemId:i.itemId,correct:i.correct});
 }
 return {...projection(d.progress),travel:d.travel??emptyTravel(),ledger:d.ledger,missions:missions.map(publicMission),attempts:d.attempts,englishReview:[...review.values()]};
}
/** Sites alone supplies these trusted identity headers. Vercel uses the explicit verified-player entry point. */
export async function handleAtlas(request:Request,database:D1Database):Promise<Response>{
 return handleAtlasForPlayer(request,d1ExpeditionStore(database),request.headers.get('oai-authenticated-user-id'));
}
export async function handleAtlasForPlayer(request:Request,store:ExpeditionStore,player:string|null):Promise<Response>{
 try{
  const url=new URL(request.url),path=url.pathname.slice(5).split('/').filter(Boolean);
  if(!player)throw new ApiError(401,'Sign in to begin your expedition.');
  if(request.method==='POST'&&request.headers.get('origin')&&!sameOrigin(request))throw new ApiError(403,'Cross-origin request rejected');
  const route=path.join('/');
  if(route==='health'&&request.method==='GET')return Response.json({ok:true,persistence:store.provider});
  let body:unknown;
  if(request.method==='POST'){
   const raw=await request.text();if(raw.length>16000)throw new ApiError(413,'Request too large');
   try{body=JSON.parse(raw);}catch{throw new ApiError(400,'Invalid JSON');}
  }
  // Read-after-write session + conditional revision update: one atomic document commit
  // preserves rewards, attempts and English evidence together across concurrent workers.
  await store.initialize(player,JSON.stringify(fresh()));
  for(let retry=0;retry<16;retry++){
   const row=await store.read(player);
   if(!row)throw new ApiError(503,'Expedition is temporarily unavailable');
   const d:Expedition=JSON.parse(row.document);
   if((route==='state'&&request.method==='GET')||(route==='session'&&request.method==='POST'))return Response.json(view(d));
   if(route==='attempts'&&request.method==='GET')return Response.json(d.attempts.map(({observed:_observed,...a})=>a));
   if(route==='travel'&&request.method==='GET')return Response.json({travel:d.travel??emptyTravel(),state:view(d)});
   if(route==='vocabulary'&&request.method==='GET')return Response.json({words:d.savedVocabulary??[]});
   let result:unknown;
   if(route==='travel/start'&&request.method==='POST'){
    const {countryId}=z.object({countryId:z.string().length(2)}).strict().parse(body);const pack=packFor(countryId);
    if(!pack||pack.country.availability!=='PLAYABLE')throw new ApiError(400,'No playable country pack is published here yet.');
    d.travel??=emptyTravel();d.travel.visitedCountries=[...new Set([...d.travel.visitedCountries,countryId])];result={travel:d.travel,state:view(d)};
   }else if(route==='travel/action'&&request.method==='POST'){
    const input=TravelSubmission.parse(body);d.travel??=emptyTravel();
    if(!encounterFor(input.encounterId))throw new ApiError(400,'Unknown travel encounter');
    if(!travelUnlocked(input.encounterId,d.travel))throw new ApiError(403,'Finish the previous travel stop first.');
    let outcome;try{outcome=evaluateTravel(input,d.travel);}catch{throw new ApiError(400,'Invalid travel action for this scene.');}const {pack,encounter}=outcome.found;
    const previous=d.travel.encounters[encounter.id];
    d.travel.encounters[encounter.id]=outcome.next;
    d.travel.visitedCountries=[...new Set([...d.travel.visitedCountries,pack.country.id])];
    const now=new Date().toISOString();let awardedXp=0;
    if(outcome.complete&&!previous?.completedAt){
     outcome.next.completedAt=now;awardedXp=awardFirstClear(d,`travel:${encounter.id}`,encounter.version,encounter.rewardXp);
     if(!d.travel.stamps.some(s=>s.id===encounter.stamp.id))d.travel.stamps.push({...encounter.stamp,countryId:pack.country.id,destinationId:encounter.destinationId,encounterId:encounter.id,earnedAt:now});
     if(pack.encounters.every(e=>!!d.travel!.encounters[e.id]?.completedAt)&&!d.travel.stamps.some(s=>s.id===pack.completionStamp.id))d.travel.stamps.push({...pack.completionStamp,countryId:pack.country.id,destinationId:encounter.destinationId,earnedAt:now});
    }
    if(outcome.advanced&&outcome.skill){
     const key=`travel:${encounter.id}:v1:${input.band}:${outcome.itemId}`,evidence=d.progress.englishEvidence??[];
     if(!evidence.some(e=>e.key===key))d.progress.englishEvidence=[...evidence,{key,missionId:`travel:${encounter.id}`,attemptId:`travel:${encounter.id}`,lessonId:`travel:${encounter.id}`,version:1,band:input.band,skill:outcome.skill,itemId:outcome.itemId!,support:input.support,recordedAt:now}];
    }
    result={correct:outcome.correct,complete:outcome.complete,feedback:outcome.feedback,awardedXp,travel:d.travel,state:view(d)};
   }else if(route==='vocabulary'&&request.method==='POST'){
    const input=z.object({lessonId:z.string().max(100),version:z.literal(1),word:z.string().max(80),saved:z.boolean()}).strict().parse(body);
    let lesson:{missionId:string;glossary:readonly {word:string}[]}|undefined=travelVocabularyLessons.find(l=>l.id===input.lessonId);if(!lesson){try{lesson=lessonById(input.lessonId,input.version);}catch{throw new ApiError(400,'Unknown vocabulary lesson');}}
    if(!lesson.glossary.some(entry=>entry.word===input.word))throw new ApiError(400,'Unknown vocabulary word');
    if(input.saved&&!(input.lessonId.startsWith('travel:')?travelUnlocked(lesson.missionId,d.travel??emptyTravel()):isUnlocked(lesson.missionId,d.progress)))throw new ApiError(403,'This trail is locked.');
    const words=d.savedVocabulary??[],matches=(word:SavedWord)=>word.lessonId===input.lessonId&&word.version===input.version&&word.word===input.word;
    d.savedVocabulary=input.saved?(words.some(matches)?words:[{lessonId:input.lessonId,version:input.version,word:input.word,savedAt:new Date().toISOString()},...words]):words.filter(word=>!matches(word));
    result={words:d.savedVocabulary};
   }else if(route==='attempts'&&request.method==='POST'){
    const input=z.object({missionId:z.string().max(100)}).strict().parse(body);
    if(!isUnlocked(input.missionId,d.progress))throw new ApiError(403,'This trail is locked. Complete the previous investigation first.');
    const m=missionById(input.missionId);
    const active=d.attempts.find(a=>a.missionId===m.id&&a.status==='ACTIVE');
    if(active)return Response.json(active,{status:201});
    const a:Attempt={id:uid(),missionId:m.id,version:m.version,observed:[],status:'ACTIVE',createdAt:new Date().toISOString()};d.attempts.push(a);result=a;
   }else if(path[0]==='attempts'&&path.length===3&&request.method==='POST'){
    const a=d.attempts.find(a=>a.id===path[1]);if(!a)throw new ApiError(404,'Attempt not found');
    const m=missionById(a.missionId,a.version);
    if(!isUnlocked(m.id,d.progress))throw new ApiError(403,'Mission prerequisites not satisfied');
    if(path[2]==='observe'){
     const {clueId}=z.object({clueId:z.string().max(100)}).strict().parse(body);
     if(m.type==='PUZZLE'||!m.challenge.observations.some(o=>o.id===clueId))throw new ApiError(400,'Invalid clue');
     a.observed=[...new Set([...a.observed,clueId])];result={observed:a.observed};
    }else if(path[2]==='submit'){
     const input=SubmissionSchema.parse(body);
     if(input.type!==m.type)throw new ApiError(400,'Challenge type mismatch');
     const outcome=evaluate(m,input,a.observed);
     d.submissions.push({id:uid(),attemptId:a.id,payload:input,...outcome,createdAt:new Date().toISOString()});
     let awardedXp=0;
     if(outcome.correct){a.status='COMPLETED';if(!d.progress.completed.includes(m.id)){
      awardedXp=awardFirstClear(d,m.id,m.version,m.rewards.xp);d.progress={...d.progress,completed:[...d.progress.completed,m.id],evidence:[...new Set([...d.progress.evidence,m.rewards.evidence])]};
     }}
     result={...outcome,awardedXp,state:view(d)};
    }else if(path[2]==='english-item'){
     const input=EnglishItemSchema.parse(body);
     let lesson;try{lesson=lessonById(input.lessonId,input.version);}catch{throw new ApiError(400,'Unknown English lesson version');}
     if(a.missionId!==lesson.missionId||a.version!==lesson.missionVersion)throw new ApiError(400,'English lesson does not match this mission');
     if(m.type!=='PUZZLE'&&!m.challenge.observations.every(c=>a.observed.includes(c.id)))throw new ApiError(400,'Inspect the mission clues first');
     let outcome;try{outcome=evaluateEnglishItem(input);}catch{throw new ApiError(400,'Unknown English answer option');}
     d.submissions.push({id:uid(),attemptId:a.id,payload:{type:'ENGLISH_ITEM',...input},...outcome,createdAt:new Date().toISOString()});
     const evidence=d.progress.englishEvidence??[],key=`${input.lessonId}:v${input.version}:${input.band}:${input.itemId}`;
     const added=outcome.correct&&!evidence.some(e=>e.key===key);
     if(added)d.progress={...d.progress,englishEvidence:[...evidence,{key,missionId:lesson.missionId,attemptId:a.id,lessonId:lesson.id,version:lesson.version,band:input.band,skill:outcome.skill,itemId:input.itemId,support:input.support,recordedAt:new Date().toISOString()}]};
     result={...outcome,newEvidence:added?1:0,state:view(d)};
    }else if(path[2]==='english'){
     const s=EnglishSubmissionSchema.parse(body);
     if(a.missionId!==forestLesson.missionId||a.version!==forestLesson.missionVersion)throw new ApiError(400,'No English practice for this mission');
     if(!['canopy','stream','wildlife'].every(c=>a.observed.includes(c)))throw new ApiError(400,'Inspect all three clues before English practice');
     let outcome;try{outcome=evaluateEnglish(s);}catch{throw new ApiError(400,'Unknown English answer option');}
     d.submissions.push({id:uid(),attemptId:a.id,payload:{type:'ENGLISH',...s},...outcome,createdAt:new Date().toISOString()});
     const evidence=d.progress.englishEvidence??[];
     const additions:EnglishEvidence[]=outcome.items.filter(i=>i.correct).map(i=>({key:`${s.lessonId}:v${s.version}:${s.band}:${i.itemId}`,missionId:'silent-forest' as const,attemptId:a.id,lessonId:s.lessonId,version:s.version,band:s.band,skill:i.skill,itemId:i.itemId,support:s.support,recordedAt:new Date().toISOString()})).filter(e=>!evidence.some(old=>old.key===e.key));
     d.progress={...d.progress,englishEvidence:[...evidence,...additions]};
     result={...outcome,newEvidence:additions.length,state:view(d)};
    }else throw new ApiError(404,'Unknown action');
   }else throw new ApiError(404,'Unknown route');
   if(await store.compareAndSwap(player,row.revision,JSON.stringify(d)))return Response.json(result,{status:201});
  }
  throw new ApiError(409,'Another action is saving. Please retry.');
 }catch(e){
  const status=e instanceof ApiError?e.status:e instanceof StorageUnavailable?503:e instanceof z.ZodError?400:500;
  if(status===500)console.error('ATLAS API error',e);
  return Response.json({message:e instanceof ApiError||e instanceof StorageUnavailable?e.message:status===400?'Invalid challenge response':'Could not save your expedition. Please retry.',...(e instanceof StorageUnavailable?{code:['PGRST205','42P01'].includes(e.code)?'DATABASE_SETUP_REQUIRED':'STORAGE_UNAVAILABLE'}:{})},{status});
 }
}
