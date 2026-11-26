import { z } from 'zod';
import { encounterFor, packFor } from '../../content/travel/japan.ts';
import { emptyTravel } from '../../content/travel/types.ts';
import { travelUnlocked } from '../../packages/domain/src/travel.ts';
import { evaluateTravel, initialEncounter, TravelSubmission } from '../../packages/mission-engine/src/travel.ts';
import { ApiError } from './api-error.ts';
import { requireCurrentRevision, saveCheckpoint } from './checkpoint.ts';
import type { Expedition } from './expedition.ts';
import { awardFirstClear, rewardFor } from './rewards.ts';

const startInput = z.object({ countryId: z.string().length(2) }).strict();

export function startTravel(expedition: Expedition, body: unknown) {
  const { countryId } = startInput.parse(body);
  const pack = packFor(countryId);
  if (!pack || pack.country.availability !== 'PLAYABLE') {
    throw new ApiError(400, 'No playable country pack is published here yet.');
  }

  const travel = (expedition.travel ??= emptyTravel());
  travel.visitedCountries = [...new Set([...travel.visitedCountries, countryId])];
  return { travel };
}

export function prepareTravelCheckpoint(expedition: Expedition, encounterId: string) {
  const found = encounterFor(encounterId);
  if (!travelUnlocked(found?.pack, encounterId, expedition.travel?.encounters)) {
    throw new ApiError(403, 'This travel stop is not available.');
  }

  const travel = (expedition.travel ??= emptyTravel());
  travel.encounters[encounterId] ??= initialEncounter();
}

export function applyTravelAction(expedition: Expedition, body: unknown, revision: number, activityTime: Date) {
  const input = TravelSubmission.parse(body);
  const travel = (expedition.travel ??= emptyTravel());
  const { action, encounterId } = input;
  if (action.kind === 'restart') requireCurrentRevision(input.expectedRevision, revision);

  const found = encounterFor(encounterId);
  if (!found) throw new ApiError(400, 'Unknown travel encounter');
  const { pack, encounter } = found;
  if (!travelUnlocked(pack, encounterId, travel.encounters)) {
    throw new ApiError(403, 'Finish the previous travel stop first.');
  }

  let outcome;
  try {
    outcome = evaluateTravel(input, travel);
  } catch {
    throw new ApiError(400, 'Invalid travel action for this scene.');
  }

  const { next, itemId, skill, complete, advanced } = outcome;
  const previous = travel.encounters[encounterId];
  const step = encounter.steps[previous?.step ?? 0];
  const matchingKind = step && (
    action.kind === step.kind ||
    (step.kind === 'dialogue' && action.kind === 'say') ||
    (step.kind === 'route' && action.kind === 'move')
  );
  const knownTarget = action.kind !== 'target' || pack.locations.find(
    location => location.id === encounter.locationId,
  )?.hotspots.some(hotspot => hotspot.id === action.target);
  const studied = Boolean(itemId && matchingKind && knownTarget &&
    (action.kind !== 'move' || action.expectedMove === (previous?.routeIndex ?? 0)));

  travel.encounters[encounterId] = next;
  travel.visitedCountries = [...new Set([...travel.visitedCountries, pack.country.id])];
  const now = activityTime.toISOString();
  const contentId: `travel:${string}` = `travel:${encounterId}`;
  let awardedXp = 0;
  if (complete && !previous?.completedAt) {
    next.completedAt = now;
    awardedXp = awardFirstClear(expedition, contentId, encounter.version, encounter.rewardXp);
    const stampContext = { countryId: pack.country.id, destinationId: encounter.destinationId };
    if (!travel.stamps.some(stamp => stamp.id === encounter.stamp.id)) {
      travel.stamps.push({ ...encounter.stamp, ...stampContext, encounterId, earnedAt: now });
    }
    if (pack.encounters.every(stop => Boolean(travel.encounters[stop.id]?.completedAt)) &&
        !travel.stamps.some(stamp => stamp.id === pack.completionStamp.id)) {
      travel.stamps.push({ ...pack.completionStamp, ...stampContext, earnedAt: now });
    }
  }

  if (advanced && skill) {
    const key = `${contentId}:v1:${input.band}:${itemId}`;
    const evidence = expedition.progress.englishEvidence ?? [];
    if (!evidence.some(entry => entry.key === key)) {
      expedition.progress.englishEvidence = [...evidence, {
        key, missionId: contentId, attemptId: contentId, lessonId: contentId,
        version: 1, band: input.band, skill, itemId: itemId!, support: input.support, recordedAt: now,
      }];
    }
  }

  if (JSON.stringify(previous) !== JSON.stringify(next)) {
    next.lastActivityRevision = revision + 1;
    if (complete) expedition.checkpoint = null;
    else saveCheckpoint(expedition, { kind: 'travel', encounterId }, revision + 1);
  }

  return {
    studied,
    payload: {
      correct: outcome.correct,
      complete,
      feedback: outcome.feedback,
      awardedXp,
      reward: rewardFor(expedition, contentId, encounter.version, awardedXp),
      travel,
    },
  };
}
