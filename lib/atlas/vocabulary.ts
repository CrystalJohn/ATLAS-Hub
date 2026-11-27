import { z } from 'zod';
import { lessonById } from '../../content/english/chapter.ts';
import type { SavedWord } from '../../content/english/vocabulary.ts';
import { encounterFor, travelVocabularyLessons } from '../../content/travel/japan.ts';
import { isUnlocked } from '../../packages/domain/src/index.ts';
import { travelUnlocked } from '../../packages/domain/src/travel.ts';
import { ApiError } from './api-error.ts';
import type { Expedition } from './expedition.ts';

const lessonIdInput = z.string().max(100);
const wordInput = z.string().max(80);
const vocabularyInput = z.discriminatedUnion('saved', [
  z.object({
    lessonId: lessonIdInput,
    version: z.literal(1),
    word: wordInput,
    saved: z.literal(true),
  }).strict(),
  z.object({
    lessonId: lessonIdInput.regex(/\S/),
    version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    word: wordInput.regex(/\S/),
    saved: z.literal(false),
  }).strict(),
]);

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
  const { words } = readVocabulary(expedition);
  const matches = (entry: SavedWord) =>
    entry.lessonId === lessonId && entry.version === version && entry.word === word;

  if (!saved) {
    const remaining = words.filter(entry => !matches(entry));
    if (remaining.length !== words.length) expedition.savedVocabulary = remaining;
    return { words: remaining };
  }

  const lesson = vocabularyLesson(lessonId, version);
  if (!lesson.glossary.some(entry => entry.word === word)) {
    throw new ApiError(400, 'Unknown vocabulary word');
  }
  const available = lessonId.startsWith('travel:')
    ? travelUnlocked(encounterFor(lesson.missionId)?.pack, lesson.missionId, expedition.travel?.encounters)
    : isUnlocked(lesson.missionId, expedition.progress);
  if (!available) throw new ApiError(403, 'This trail is locked.');

  if (!words.some(matches)) {
    expedition.savedVocabulary = [{ lessonId, version, word, savedAt: activityTime.toISOString() }, ...words];
  }
  return readVocabulary(expedition);
}
