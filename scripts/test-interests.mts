import assert from 'node:assert/strict';
import {suggestionsFor} from '../lib/atlas/recommendations.ts';
import {emptyProgress,projection} from '../packages/domain/src/index.ts';
import {missions,publicMission} from '../content/missions/index.ts';
import {travelPacks} from '../content/travel/japan.ts';
import {emptyTravel} from '../content/travel/types.ts';

const fresh={...projection(emptyProgress()),missions:missions.map(publicMission),attempts:[],ledger:[],englishReview:[],travel:emptyTravel()};
const snapshot=JSON.stringify(fresh),pack=travelPacks[0];
assert.deepEqual(suggestionsFor([],fresh),[]);
const nature=suggestionsFor(['nature'],fresh);
assert.equal(nature.length,1);assert.equal(nature[0].kind,'nature');
if(nature[0].kind==='nature')assert.equal(nature[0].missionId,'silent-forest');
const food=suggestionsFor(['food'],fresh);
assert.equal(food.length,1);assert.equal(food[0].kind,'travel');
if(food[0].kind==='travel'){assert.equal(food[0].nextEncounterId,pack.encounters[0].id);assert.equal(food[0].laterInterest,true,'Locked food scene cannot be recommended as open');}
const mixed=suggestionsFor(['nature','food','culture'],fresh);
assert.equal(mixed[0].kind,'travel','Selected interests affect ordering');assert.equal(mixed.length,2);
assert.equal(JSON.stringify(fresh),snapshot,'Suggestions must never mutate progression');
const forestDone={...fresh,completed:['silent-forest' as const],unlocked:['silent-forest' as const,'disappearing-lake' as const]};
const next=suggestionsFor(['nature'],forestDone)[0];if(next.kind==='nature')assert.equal(next.missionId,'disappearing-lake');
const travel=emptyTravel();
for(const encounter of pack.encounters.slice(0,2))travel.encounters[encounter.id]={step:encounter.steps.length,routeIndex:0,seen:[],completedAt:'2026-10-20T00:00:00Z'};
const restaurant=suggestionsFor(['food'],{...fresh,travel})[0];
if(restaurant.kind==='travel'){assert.equal(restaurant.nextEncounterId,pack.encounters[2].id);assert.equal(restaurant.laterInterest,false);}
const culture=suggestionsFor(['culture'],fresh)[0];assert.equal(culture.kind,'travel');
console.log('PASS interests: topic-based selection/ordering, open Forest mission, sequential travel gates, later-topic explanation, empty selection and immutable progression.');
