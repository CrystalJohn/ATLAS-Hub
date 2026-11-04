import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAtlasLocation,atlasHref,type AtlasLocation} from '../app/components/atlas-navigation.ts';

test('world and section deep links round-trip without carrying player progress',()=>{
 const locations:AtlasLocation[]=[{world:'travel',section:'map'},{world:'travel',section:'journey'},{world:'travel',section:'passport'},{world:'travel',section:'country',id:'JP'},{world:'travel',section:'encounter',id:'jp-arrival'},{world:'travel',section:'tower',id:'JP'},{world:'nature',section:'map'},{world:'nature',section:'journey'},{world:'nature',section:'field-journal'},{world:'nature',section:'mission',id:'silent-forest'},{world:'nature',section:'summary'},{world:'travel',section:'journal'},{world:'nature',section:'help'}];
 for(const location of locations)assert.deepEqual(parseAtlasLocation(atlasHref(location)),location);
});
test('empty and legacy anchor links have a supported landing destination',()=>{
 for(const hash of ['','#chapter-screen','#unknown'])assert.deepEqual(parseAtlasLocation(hash),{world:'travel',section:'map'});
});
test('malformed links and cross-world sections cannot invent destinations',()=>{
 for(const hash of ['#/travel/mission/silent-forest','#/travel/summary','#/travel/field-journal','#/travel/country','#/travel/tower','#/travel/country/../../secret'])assert.deepEqual(parseAtlasLocation(hash),{world:'travel',section:'map'});
 for(const hash of ['#/nature/passport','#/nature/country/JP','#/nature/encounter/jp-arrival','#/nature/mission/invalid%2fid'])assert.deepEqual(parseAtlasLocation(hash),{world:'nature',section:'map'});
});
