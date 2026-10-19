import type {Copy} from '../../../content/travel/types';
export function TravelCopy({text,vi}:{text:Copy;vi:boolean}){return <span className="travel-copy"><span lang="en">{text.en}</span>{vi&&<small lang="vi">{text.vi}</small>}</span>;}
