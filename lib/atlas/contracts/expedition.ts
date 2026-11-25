import type { publicMission } from '../../../content/missions/index';
import type { PlayerTravelProgress } from '../../../content/travel/types';
import type { projection } from '../../../packages/domain/src/index';
import type { StudySummary } from '../../../packages/domain/src/study';
import type { evaluateEnglishItem } from '../../../packages/english-engine/src/chapter';

export type AdventurePhase = 'brief' | 'explore' | 'english' | 'subject';

export type ResumeTarget =
  | {
    kind: 'travel';
    countryId: string;
    destinationId: string;
    encounterId: string;
    contentVersion: number;
    step: number;
    stepId: string;
    routeIndex: number;
    replay: boolean;
  }
  | {
    kind: 'nature';
    missionId: string;
    attemptId: string;
    contentVersion: number;
    phase: AdventurePhase;
    observed: string[];
    replay: boolean;
  };

export type ResumeState = {
  schemaVersion: 1;
  revision: number;
  target: ResumeTarget | null;
  recovered: boolean;
  reason: 'SAVED' | 'LEGACY_RECOVERED' | 'INVALID_CHECKPOINT' | 'CONTENT_CHANGED' | 'NONE';
};

export type Mission = ReturnType<typeof publicMission>;

export type Attempt = {
  id: string;
  missionId: string;
  version: number;
  observed: string[];
  status: string;
  createdAt: string;
};

export type AtlasState = ReturnType<typeof projection> & {
  revision?: number;
  resume?: ResumeState;
  studyHistory?: StudySummary;
  travel?: PlayerTravelProgress;
  missions: Mission[];
  attempts: Attempt[];
  englishReview: { lessonId: string; band: string; itemId: string; correct: boolean }[];
  ledger: { id: string; missionId: string; amount: number; contentVersion: number; createdAt: string }[];
};

export type EnglishResult = ReturnType<typeof evaluateEnglishItem> & { newEvidence: number; state: AtlasState };
export type SubjectResult = { correct: boolean; feedback: string; awardedXp: number; state: AtlasState };
