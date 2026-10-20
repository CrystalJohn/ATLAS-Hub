import type {ExplorationInterest} from '../../content/interests.ts';
import {travelPacks} from '../../content/travel/japan.ts';
import type {AtlasState} from '../../app/components/chapter-types';

type SuggestionState=Pick<AtlasState,'missions'|'completed'|'unlocked'|'travel'>;
export type InterestSuggestion={kind:'nature';missionId:string;title:string;review:boolean;matches:ExplorationInterest[]}|{kind:'travel';title:{en:string;vi:string};stop:{en:string;vi:string};matches:ExplorationInterest[];nextEncounterId:string;laterInterest:boolean};
/** Presentation only: recommends available content; never evaluates or unlocks it. */
export function suggestionsFor(interests:readonly ExplorationInterest[],state:SuggestionState):InterestSuggestion[]{
 const suggestions:InterestSuggestion[]=[];
 if(interests.includes('nature')){
  const available=state.missions.filter(m=>state.unlocked.includes(m.id));
  const mission=available.find(m=>!state.completed.includes(m.id))??available[0];
  if(mission)suggestions.push({kind:'nature',missionId:mission.id,title:mission.title,review:state.completed.includes(mission.id),matches:['nature']});
 }
 const matches=interests.filter(id=>id!=='nature');
 const pack=travelPacks[0];
 if(matches.length&&pack){
  const progress=state.travel?.encounters??{};
  const available=pack.encounters.filter((_,i)=>i===0||!!progress[pack.encounters[i-1].id]?.completedAt);
  const next=available.find(e=>!progress[e.id]?.completedAt)??available[0];
  if(next){
   const tags:Record<string,readonly ExplorationInterest[]>={
    [pack.encounters[0].id]:['travel'],[pack.encounters[1].id]:['travel','culture'],[pack.encounters[2].id]:['travel','food'],[pack.encounters[3].id]:['travel','culture'],
   };
   suggestions.push({kind:'travel',title:pack.country.name,stop:next.title,matches,nextEncounterId:next.id,laterInterest:!matches.some(id=>tags[next.id]?.includes(id))});
  }
 }
 return suggestions.sort((a,b)=>b.matches.length-a.matches.length);
}
