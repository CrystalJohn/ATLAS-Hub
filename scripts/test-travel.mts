import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {travelPacks} from '../content/travel/japan.ts';
import {travelRules} from '../lib/atlas/travel-rules.ts';
for(const pack of travelPacks){
 assert.equal(pack.category,'WORLD_TRAVEL');assert.equal(pack.encounters.length,4);
 for(const encounter of pack.encounters){
  const location=pack.locations.find(l=>l.id===encounter.locationId)!;assert.ok(location);
  assert.ok((await readFile(`public${location.scene}`)).length>1000);assert.equal(encounter.vocabulary.length,4);
  for(const id of [...encounter.sourceIds,...location.hotspots.flatMap(h=>h.sourceIds)])assert.ok(pack.sources.some(s=>s.id===id));
  for(const step of encounter.steps){
   assert.ok(travelRules[encounter.id]?.[step.id]);
   for(const b of ['A1','A2','B1','B2'] as const)assert.ok(step.objective[b].en&&step.objective[b].vi);
   if(step.kind==='route'){let [x,y]=step.grid.start;for(const move of travelRules[encounter.id][step.id].route!){const d={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]}[move];x+=d[0];y+=d[1];assert.ok(x>=0&&x<step.grid.width&&y>=0&&y<step.grid.height);}assert.deepEqual([x,y],step.grid.goal);}
  }
 }
}
console.log('PASS travel content: pack contracts, artwork assets, source references, vocabulary, server rules, bilingual objectives and route paths.');
