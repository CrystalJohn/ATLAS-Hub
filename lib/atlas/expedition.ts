import type { SavedWord } from '../../content/english/vocabulary.ts';
import type { PlayerTravelProgress } from '../../content/travel/types.ts';
import type { Progress } from '../../packages/domain/src/index.ts';
import type { StudyHistory } from '../../packages/domain/src/study.ts';
import type { Attempt } from './contracts/expedition.ts';
import type { TowerNamespace } from './tower-state.ts';

export type ExpeditionAttempt = Attempt & {
  completedAt?: string;
  lastActivityRevision?: number;
};

type Ledger = {
  id: string;
  missionId: string;
  contentVersion: number;
  amount: number;
  createdAt: string;
};

export type Expedition = {
  progress: Progress;
  attempts: ExpeditionAttempt[];
  ledger: Ledger[];
  submissions: unknown[];
  savedVocabulary?: SavedWord[];
  travel?: PlayerTravelProgress;
  checkpoint?: unknown;
  tower?: TowerNamespace;
  studyHistory?: StudyHistory;
};
