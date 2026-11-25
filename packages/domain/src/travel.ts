import type { CountryPack, PlayerTravelProgress } from '../../../content/travel/types.ts';

export function travelUnlocked(
  pack: Pick<CountryPack, 'encounters'> | undefined,
  encounterId: string,
  progress?: PlayerTravelProgress['encounters'],
): boolean {
  if (!pack) return false;

  const index = pack.encounters.findIndex(encounter => encounter.id === encounterId);
  return index === 0 || (index > 0 && Boolean(progress?.[pack.encounters[index - 1].id]?.completedAt));
}
