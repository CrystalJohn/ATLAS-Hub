import { z } from 'zod';
import { lessonById } from '../../content/english/chapter.ts';
import type { SavedWord } from '../../content/english/vocabulary.ts';
import { encounterFor, travelVocabularyLessons } from '../../content/travel/japan.ts';
import { isUnlocked } from '../../packages/domain/src/index.ts';
import { travelUnlocked } from '../../packages/domain/src/travel.ts';
import { ApiError } from './api-error.ts';
import type { Expedition } from './expedition.ts';

const vocabularyInput = z.object({
  lessonId: z.string().max(100),
  version: z.literal(1),
  word: z.string().max(80),
  saved: z.boolean(),
}).strict();

function vocabularyLesson(lessonId: string, version: number) {
  const travelLesson = travelVocabularyLessons.find(lesson => lesson.id === lessonId);
  if (travelLesson) return travelLesson;

  try {
    return lessonById(lessonId, version);
  } catch {
    throw new ApiError(400, 'Unknown vocabulary lesson');
  }
}

export function readVocabulary(expedition: Expedition) {
  return { words: expedition.savedVocabulary ?? [] };
}

export function updateVocabulary(expedition: Expedition, body: unknown, activityTime: Date) {
  const { lessonId, version, word, saved } = vocabularyInput.parse(body);
  const lesson = vocabularyLesson(lessonId, version);
  if (!lesson.glossary.some(entry => entry.word === word)) {
    throw new ApiError(400, 'Unknown vocabulary word');
  }
  if (saved) {
    const available = lessonId.startsWith('travel:')
      ? travelUnlocked(encounterFor(lesson.missionId)?.pack, lesson.missionId, expedition.travel?.encounters)
      : isUnlocked(lesson.missionId, expedition.progress);
    if (!available) throw new ApiError(403, 'This trail is locked.');
  }

  const { words } = readVocabulary(expedition);
  const matches = (entry: SavedWord) =>
    entry.lessonId === lessonId && entry.version === version && entry.word === word;

  if (!saved) {
    expedition.savedVocabulary = words.filter(entry => !matches(entry));
  } else {
    expedition.savedVocabulary = words.some(matches)
      ? words
      : [{ lessonId, version, word, savedAt: activityTime.toISOString() }, ...words];
  }
  return readVocabulary(expedition);
}
