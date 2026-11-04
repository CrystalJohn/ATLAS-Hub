'use client';
import {useSyncExternalStore} from 'react';
export type AtlasWorld='travel'|'nature';
export type AtlasSection='map'|'journey'|'passport'|'journal'|'field-journal'|'help'|'country'|'encounter'|'tower'|'mission'|'summary';
export type AtlasLocation={world:AtlasWorld;section:AtlasSection;id?:string};
const sections=new Set<AtlasSection>(['map','journey','passport','journal','field-journal','help','country','encounter','tower','mission','summary']);
export function parseAtlasLocation(hash:string):AtlasLocation{
 const [world,section,id,...rest]=hash.replace(/^#\/?/,'').split('/');
 if(!['travel','nature'].includes(world)||!sections.has(section as AtlasSection)||rest.length)return {world:'travel',section:'map'};
 if(id&&!/^[a-zA-Z0-9_-]{1,80}$/.test(id))return {world:world as AtlasWorld,section:'map'};
 if((world==='travel'&&['mission','summary','field-journal'].includes(section))||(world==='nature'&&['country','encounter','tower','passport'].includes(section)))return {world:world as AtlasWorld,section:'map'};
 if(['country','encounter','tower','mission'].includes(section)&&!id)return {world:world as AtlasWorld,section:'map'};
 return {world:world as AtlasWorld,section:section as AtlasSection,...(id?{id}:{})};
}
export const atlasHref=(location:AtlasLocation)=>`#/${location.world}/${location.section}${location.id?'/'+location.id:''}`;
const subscribe=(listener:()=>void)=>{window.addEventListener('hashchange',listener);window.addEventListener('popstate',listener);window.addEventListener('atlas:navigation',listener);return()=>{window.removeEventListener('hashchange',listener);window.removeEventListener('popstate',listener);window.removeEventListener('atlas:navigation',listener)}};
export function goAtlas(location:AtlasLocation,replace=false){const hash=atlasHref(location);if(window.location.hash===hash)return;window.history[replace?'replaceState':'pushState'](null,'',hash);window.dispatchEvent(new Event('atlas:navigation'));}
export function useAtlasNavigation(){const hash=useSyncExternalStore(subscribe,()=>window.location.hash,()=> '');return {location:parseAtlasLocation(hash),go:goAtlas};}
