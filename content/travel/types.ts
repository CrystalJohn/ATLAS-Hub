import type {ReadingBand,GlossaryEntry} from '../english/chapter';
export type Copy={en:string;vi:string};
export type Availability='PLAYABLE'|'PREVIEW'|'COMING_SOON';
export type RegionCategory='NATURE_REALM'|'WORLD_TRAVEL';
export type LevelText=Record<ReadingBand,Copy>;
export type EvidenceKind='verified-fact'|'fictional-scenario'|'generalized-advice';
export interface TravelSource{id:string;organization:string;title:string;url:string;verifiedAt:string;publishedAt?:string;role:'fact'|'language'|'visual-reference'}
export interface Country{id:string;name:Copy;availability:Availability;intro:Copy;coordinates:[number,number];destinationIds:string[]}
export interface Destination{id:string;name:Copy;description:Copy;availability:Availability;locationIds:string[];stops?:{locationId:string;at:[number,number]}[];artwork:string}
export interface Location{id:string;name:Copy;scene:string;encounterId:string;classification:'fictional-scenario';hotspots:Hotspot[]}
export interface Hotspot{id:string;label:Copy;at:[number,number];description:Copy;sourceIds:string[];kind:'npc'|'object'|'destination'}
export interface LearningObjective{id:string;skill:'reading'|'vocabulary';description:Copy}
export interface VocabularyEntry extends GlossaryEntry{us:string;uk:string;sourceUrl:string}
export interface NPCDialogue{id:string;speaker:string;prompt:LevelText;responses:{id:string;text:LevelText}[];reply:LevelText}
interface StepBase{id:string;objective:LevelText;skill?:'reading'|'vocabulary'}
export type TravelStep=(StepBase&{kind:'inspect'|'target'})|(StepBase&{kind:'dialogue';dialogue:NPCDialogue})|(StepBase&{kind:'route';instruction:LevelText;grid:{width:number;height:number;start:[number,number];goal:[number,number];goalLabel:Copy}})|(StepBase&{kind:'order';dishes:{id:string;name:Copy;ingredients:Copy}[];preferences:{id:string;text:Copy}[]})|(StepBase&{kind:'compose';tiles:{id:string;text:string}[]});
export interface TravelEncounter{id:string;version:1;destinationId:string;locationId:string;title:Copy;description:Copy;objectives:LearningObjective[];vocabulary:VocabularyEntry[];steps:TravelStep[];rewardXp:number;stamp:PassportStampDefinition;sourceIds:string[]}
export interface PassportStampDefinition{id:string;name:Copy;icon:'plane'|'compass'|'bowl'|'gate'|'globe'}
export interface PassportStamp extends PassportStampDefinition{countryId:string;destinationId:string;encounterId?:string;earnedAt:string}
export interface EncounterProgress{step:number;routeIndex:number;position?:[number,number];seen:string[];completedAt?:string}
export interface PlayerTravelProgress{version:1;visitedCountries:string[];encounters:Record<string,EncounterProgress>;stamps:PassportStamp[]}
export interface CountryPack{schemaVersion:1;category:'WORLD_TRAVEL';country:Country;destinations:Destination[];locations:Location[];encounters:TravelEncounter[];completionStamp:PassportStampDefinition;sources:TravelSource[]}
export type TravelAction={kind:'inspect'|'target';target:string}|{kind:'say';choice:string}|{kind:'move';direction:'up'|'right'|'down'|'left';expectedMove:number}|{kind:'order';dish:string;preference:string}|{kind:'compose';tiles:string[]}|{kind:'restart'};
export const emptyTravel=():PlayerTravelProgress=>({version:1,visitedCountries:[],encounters:{},stamps:[]});
