import {z} from 'zod';
import type {Copy} from '../travel/types';

export type TowerCopy = Copy;
export const IdSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9:_-]+$/);
export const RevisionSchema = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER - 1);
export const CopySchema = z.object({en:z.string().min(1),vi:z.string().min(1)}).strict();
export const SourceRefSchema = z.enum(['P01','P02','P03','P04','P05','P06','P07','P08']);
export const ReviewSchema = z.object({
  assistantSemanticCheck:z.string().min(1), viStatus:z.string().min(1),
  educatorSignoff:z.null(), independentAdversarialSignoff:z.null(), ownerPublicationApproval:z.null(),
}).strict();
export const ChoiceSchema = z.object({id:IdSchema,text:CopySchema}).strict();
export const PartSchema = z.object({
  id:IdSchema, stem:CopySchema, options:z.array(ChoiceSchema).length(3),
  sourceRefs:z.array(SourceRefSchema).min(1), objectiveIds:z.array(IdSchema).min(1),
  remediationId:z.enum(['R-VOC','R-SIGN','R-ASK','R-FOLLOW']),
}).strict();
export const QuestionSchema = z.object({
  id:IdSchema, revision:z.number().int().positive(), status:z.literal('DRAFT'),
  floor:z.number().int().min(1).max(5), familyId:IdSchema, conceptTags:z.array(IdSchema).min(1),
  format:z.enum(['single-select','two-part-single-select']), intendedBand:z.string().min(1),
  bandRationale:z.string().min(1), evidenceKind:z.literal('cued-recognition'),
  fictionClassification:z.literal('fictional-scenario'), stimulus:CopySchema,
  parts:z.array(PartSchema).min(1).max(2), review:ReviewSchema,
}).strict();
export const DefinitionSchema = z.object({
  towerId:IdSchema, definitionVersion:z.literal(1), bankId:IdSchema, bankRevision:z.number().int().positive(),
  status:z.literal('DRAFT'), publicationEligible:z.literal(false),
  floorCount:z.literal(5), bossFloor:z.literal(5), rewardPolicy:z.literal('DISABLED'),
  ruleVersion:z.literal('c0-atomic-boss-v1'),
  origin:z.object({schema:z.string().min(1),date:z.string().min(1),sourceCommit:z.string().regex(/^[a-f0-9]{40}$/),
    sourceDocument:z.string().min(1),provenanceDocument:z.string().min(1),notes:z.array(z.string())}).strict(),
  questions:z.array(QuestionSchema).min(10),
}).strict();

// This is trusted evaluator input, never a client command or presentation field.
export const KeysSchema = z.object({
  bankId:IdSchema, bankRevision:z.number().int().positive(),
  questions:z.array(z.object({id:IdSchema,revision:z.number().int().positive(),
    parts:z.array(z.object({id:IdSchema,answerId:IdSchema,
      feedback:z.array(z.object({choiceId:IdSchema,rationale:CopySchema}).strict()).length(3),
    }).strict()).min(1).max(2),
  }).strict()).min(10),
}).strict();

export type TowerDefinition = z.infer<typeof DefinitionSchema>;
export type TowerAnswerKeys = z.infer<typeof KeysSchema>;
export type TowerQuestion = z.infer<typeof QuestionSchema>;
export type DeepReadonly<T> = T extends object ? {readonly [K in keyof T]:DeepReadonly<T[K]>} : T;
export type Answer = {partId:string;choiceId:string};
export type PinnedQuestion = {id:string;revision:number;floor:number;parts:{id:string;choiceOrder:string[]}[]};
export type PartResult = {
  partId:string;choiceId:string;correct:boolean;advancesDecision:boolean;
  selectedText:TowerCopy;acceptedChoiceId:string;acceptedText:TowerCopy;
  selectedExplanation:TowerCopy;correctExplanation:TowerCopy;
  sourceRefs:string[];remediationId:string;
};
export type Receipt = {
  operationId:string;fingerprint:string;runId:string;questionId:string;questionRevision:number;
  floor:number;outcome:'ADVANCED'|'FAILED'|'COMPLETED';resultingRevision:number;
  clearedFloors:number;advancedDecisions:number;parts:PartResult[];
};
type RunData = {
  status:'IN_PROGRESS'|'FAILED'|'COMPLETED';runId:string;seed:number;revision:number;
  manifestDigest:string;towerId:string;bankId:string;bankRevision:number;
  ruleVersion:'c0-atomic-boss-v1';rewardPolicy:'DISABLED';
  pinned:PinnedQuestion[];clearedFloors:number;advancedDecisions:number;
  selections:Answer[];receipts:Receipt[];
  // T1 retains identities for its prototype lifecycle. T2 owns durable history/retention.
  usedRunIds:string[];assignmentHistory:string[][];
};
export type TowerRun = DeepReadonly<RunData>;
export type TowerState = DeepReadonly<{status:'NOT_STARTED'}> | TowerRun;
export type ErrorCode = 'INVALID_REQUEST'|'INVALID_STATE'|'WRONG_RUN'|'WRONG_QUESTION'|
  'STALE_REVISION'|'CONTENT_MISMATCH'|'INVALID_CHOICE'|'INCOMPLETE_SELECTION'|
  'SELECTION_MISMATCH'|'OPERATION_CONFLICT'|'RUN_ID_REUSED';
export type TransitionResult =
  | {ok:true;state:TowerState;replayed:boolean;receipt?:DeepReadonly<Receipt>}
  | {ok:false;state:TowerState;error:{code:ErrorCode;message:string;isLanguageMistake:false}};

/** Explicit allowlist: no answer keys, feedback, provenance excerpts or future items. */
export type TowerPresentation = {
  status:TowerState['status'];draft:true;publicationEligible:false;
  runId?:string;revision?:number;clearedFloors?:number;floorCount:5;
  question?:{id:string;revision:number;floor:number;stimulus:string;
    parts:{id:string;stem:string;options:{id:string;text:string}[];selectedChoiceId?:string}[]};
};
