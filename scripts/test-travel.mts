import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {handleAtlas} from '../lib/atlas/service.ts';
import {travelPacks} from '../content/travel/japan.ts';
import {travelRules} from '../lib/atlas/travel-rules.ts';
for(const pack of travelPacks){assert.equal(pack.category,'WORLD_TRAVEL');assert.equal(pack.encounters.length,4);for(const encounter of pack.encounters){const location=pack.locations.find(l=>l.id===encounter.locationId)!;assert.ok(location);assert.ok((await readFile(`public${location.scene}`)).length>1000);assert.equal(encounter.vocabulary.length,4);for(const id of [...encounter.sourceIds,...location.hotspots.flatMap(h=>h.sourceIds)])assert.ok(pack.sources.some(s=>s.id===id));for(const step of encounter.steps){assert.ok(travelRules[encounter.id]?.[step.id]);for(const b of ['A1','A2','B1','B2'] as const)assert.ok(step.objective[b].en&&step.objective[b].vi);if(step.kind==='route'){let [x,y]=step.grid.start;for(const move of travelRules[encounter.id][step.id].route!){const d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[move];x+=d[0];y+=d[1];assert.ok(x>=0&&x<step.grid.width&&y>=0&&y<step.grid.height);}assert.deepEqual([x,y],step.grid.goal);}}}}
const require=createRequire(import.meta.resolve('wrangler'));const {Miniflare}=require('miniflare');
const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("test")}}',compatibilityDate:'2026-05-15',d1Databases:['DB']});
try{
 const db=await mf.getD1Database('DB');await db.prepare(await readFile('drizzle/0000_parallel_guardian.sql','utf8')).run();
 const call=async(path:string,body?:unknown,user='travel-player',origin='https://atlas.test')=>{const r=await handleAtlas(new Request(`https://atlas.test/api/${path}`,{method:body===undefined?'GET':'POST',headers:{'oai-authenticated-user-id':user,origin,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})}),db);return {status:r.status,body:await r.json() as any};};
 const payload=(id:string,stepId:string,action:unknown)=>({encounterId:id,version:1,stepId,band:'A2',support:{vietnamese:true,glossary:false},action});
 assert.equal((await call('travel')).status,200);assert.equal((await call('travel',undefined,'')).status,401);assert.equal((await call('travel/start',{countryId:'JP'},'travel-player','https://evil.test')).status,403);
 assert.equal((await call('travel/start',{countryId:'FR'})).status,400);assert.equal((await call('travel/start',{countryId:'JP',xp:500})).status,400);
 assert.equal((await call('travel/action',payload('jp-food','read-menu',{kind:'inspect',target:'menu'}))).status,403);
 await call('travel/start',{countryId:'JP'});let state=(await call('state')).body;assert.equal(state.xp,0);assert.equal(state.level,1);assert.deepEqual(state.travel.visitedCountries,['JP']);
 const wrong=await call('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));assert.equal(wrong.body.correct,false);assert.equal(wrong.body.state.travel.encounters['jp-arrival'].step,0);
 assert.equal((await call('travel/action',{...payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'}),awardedXp:999})).status,400);
 assert.equal((await call('travel/action',payload('jp-arrival','read-signs',{kind:'inspect',target:'invented'}))).status,400);
 const first=payload('jp-arrival','read-signs',{kind:'inspect',target:'signs'});await Promise.all(Array.from({length:8},()=>call('travel/action',first)));assert.equal((await call('state')).body.travel.encounters['jp-arrival'].step,1);
 await call('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'food'}));assert.equal((await call('state')).body.travel.encounters['jp-arrival'].step,1);
 await call('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));
 const finish=payload('jp-arrival','find-train',{kind:'target',target:'station'});const all=await Promise.all(Array.from({length:12},()=>call('travel/action',finish)));assert.equal(all.reduce((sum,r)=>sum+(r.body.awardedXp??0),0),30);
 assert.equal((await call('state')).body.travel.stamps.length,1);
 const plans=[
 ['jp-directions',[['read-map',{kind:'inspect',target:'map'}],['ask-route',{kind:'say',choice:'bookshop'}],['walk-route',{kind:'move',direction:'up',expectedMove:0}],['walk-route',{kind:'move',direction:'right',expectedMove:1}],['walk-route',{kind:'move',direction:'up',expectedMove:2}]]],
 ['jp-food',[['read-menu',{kind:'inspect',target:'menu'}],['ask-ingredients',{kind:'say',choice:'ingredients'}],['inspect-ingredients',{kind:'inspect',target:'ingredients'}],['place-order',{kind:'order',dish:'vegetable',preference:'no-egg'}]]],
 ['jp-culture',[['look-gate',{kind:'inspect',target:'gate'}],['look-shops',{kind:'inspect',target:'shops'}],['ask-guide',{kind:'say',choice:'about'}],['share-visit',{kind:'compose',tiles:['i','enjoyed','gate','and','shops']}]]],
 ] as const;
 for(const [id,steps] of plans){for(const [step,action] of steps){if(id==='jp-directions'&&step==='walk-route'&&action.kind==='move'&&action.expectedMove===1){const stale=await call('travel/action',payload(id,step,{kind:'move',direction:'up',expectedMove:0}));assert.equal(stale.body.correct,false);assert.equal(stale.body.state.travel.encounters[id].routeIndex,1);}const r=await call('travel/action',payload(id,step,action));assert.equal(r.status,201,JSON.stringify(r.body));assert.equal(r.body.correct,true,JSON.stringify(r.body));}}
 state=(await call('session',{})).body;assert.equal(state.xp,160);assert.equal(state.level,2);assert.equal(state.travel.stamps.length,5);assert.equal(state.travel.stamps.filter((s:any)=>s.id==='jp-starter').length,1);assert.ok(state.travel.encounters['jp-culture'].completedAt);assert.equal(state.mastery,'NOT_STARTED');assert.deepEqual(state.completed,[]);assert.deepEqual(state.unlocked,['silent-forest']);assert.equal(state.englishEvidence.length,8);assert.equal(state.englishMastery.reading.items,6);assert.equal(state.englishMastery.vocabulary.items,2);assert.equal(state.englishMastery.listening.status,'NOT_ASSESSED');assert.equal(state.englishMastery.speaking.status,'NOT_ASSESSED');assert.equal(state.englishMastery.cefrProficiency,null);
 assert.equal((await call('travel',undefined,'other-traveler')).body.travel.stamps.length,0);
 const saved={lessonId:'travel:jp-food',version:1,word:'without',saved:true};assert.equal((await call('vocabulary',saved)).status,201);assert.equal((await call('vocabulary')).body.words[0].word,'without');assert.equal((await call('state')).body.xp,160);
 assert.equal((await call('vocabulary',{...saved,word:'invented'})).status,400);
 await call('travel/action',payload('jp-arrival','',{kind:'restart'}));await call('travel/action',first);await call('travel/action',payload('jp-arrival','ask-staff',{kind:'say',choice:'ask'}));assert.equal((await call('travel/action',finish)).body.awardedXp,0);assert.equal((await call('state')).body.travel.stamps.length,5);
 // Nature Realm still works for a traveler, with the same ledger and level system.
 const a=(await call('attempts',{missionId:'silent-forest'})).body;for(const clueId of ['canopy','stream','wildlife'])await call(`attempts/${a.id}/observe`,{clueId});assert.equal((await call(`attempts/${a.id}/submit`,{type:'DISCOVERY',answer:'linked'})).body.awardedXp,30);assert.equal((await call('state')).body.xp,190);
 console.log('PASS travel: pack contracts/assets, no level gate, locked stops, strict schemas, auth/origin, wrong/stale actions, 8 concurrent observations, 12 concurrent first-clear rewards, all four encounters, five stamps, reload/isolation, eight English evidence items, vocabulary save, replay, shared XP and preserved Forest completion.');
}finally{await mf.dispose();}
