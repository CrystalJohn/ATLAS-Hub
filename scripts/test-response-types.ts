export type AtlasTestBody = {
  id: string;
  xp: number;
  level: number;
  awardedXp: number;
  newEvidence: number;
  correct: boolean;
  correctText: string;
  quote: string;
  code: string;
  revision: number;
  restored: boolean;
  mastery: string;
  state: AtlasTestBody;
  englishEvidence: unknown[];
  englishMastery: {
    reading: { items: number; status: string };
    vocabulary: { items: number; status: string };
    speaking: { status: string };
    listening: { status: string };
    cefrProficiency: string | null;
  };
  ledger: { amount: number }[];
  completed: string[];
  unlocked: string[];
  attempts: unknown[];
  englishReview: { correct: boolean; lessonId: string; itemId: string }[];
  resume: { revision: number; target: unknown };
  travel: {
    stamps: { id: string }[];
    visitedCountries: string[];
    encounters: Record<string, { completedAt?: string; step: number; routeIndex: number }>;
  };
  words: { word: string; savedAt: string }[];
};

export type ProfileTestBody = {
  code: string;
  profile: {
    playerId: string;
    displayName: string | null;
    avatarUrl: string | null;
    readingBand: string;
    vietnameseSupport: boolean;
    interests: string[];
  };
};
