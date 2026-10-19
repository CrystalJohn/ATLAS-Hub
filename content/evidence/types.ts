import type {ReadingBand} from '../english/chapter';
export type EvidenceClass='verified-fact'|'real-measurement'|'fictional-scenario'|'simulated-data'|'unconfirmed-hypothesis'|'case-inference';
export type LearningCopy={en:string;vi:string};
export type EvidenceCitation={sourceId:string;locator:string;relationship:'supports'|'background-only'};
export interface EvidenceSource {
 id:string;organization:string;title:string;url:string;
 authority:'government'|'university'|'peer-reviewed';
 publishedAt:string|null;updatedAt:string|null;dateNote:string;lastVerifiedAt:string;
 verificationNote:string;
}
export interface LearningClaim {
 id:string;classification:EvidenceClass;
 explanation:Record<ReadingBand,LearningCopy>;
 citations:EvidenceCitation[];visualIds:string[];
 reveal:'inspection'|'after-attempt';
 provenance?:{origin:string;method:string;limitations:string};
 realMeasurement?:{datasetUrl:string;measuredAt:string;location:string;method:string};
}
export interface VisualEvidence {
 id:string;kind:'diagram'|'comparison-chart'|'photograph';src:string;
 alt:LearningCopy;caption:LearningCopy;
 role:'conceptual-explanation'|'simulated-comparison'|'real-observation';
 claimIds:string[];citations:EvidenceCitation[];
 attribution:{creator:string;license:string;licenseUrl:string;sourceUrl:string;modifications:string};
 reveal:'inspection'|'after-attempt';
}
export interface EvidenceVocabulary {word:string;meaning:LearningCopy;example:LearningCopy;claimIds:string[];}
export interface MissionEvidence {
 missionId:string;missionVersion:number;status:'private-review';
 sources:EvidenceSource[];claims:LearningClaim[];visuals:VisualEvidence[];vocabulary:EvidenceVocabulary[];
 // Each published content field must be classified; factual fields map to cited claims.
 coverage:{path:string;text:string;classification:EvidenceClass;claimIds:string[]}[];
}
