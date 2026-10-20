import { z } from 'zod';
import {interestIds,type ExplorationInterest} from '../../content/interests.ts';

export const playerName = z.string().trim().min(1, 'Choose a player name.').max(40, 'Use 40 characters or fewer.')
  .refine(value => !/[\p{Cc}\p{Cf}]/u.test(value), 'Use a name without hidden or control characters.');
export const profilePatch = z.object({
  displayName: playerName.optional(),
  vietnameseSupport: z.boolean().optional(),
  readingBand: z.enum(['A1', 'A2', 'B1', 'B2']).optional(),
  interests: z.array(z.enum(interestIds)).max(4).refine(values=>new Set(values).size===values.length,'Choose each interest once.').optional(),
}).strict().refine(value => Object.keys(value).length > 0, 'Choose something to update.');

export type ProfilePatch = z.infer<typeof profilePatch>;
export type PlayerProfile = {
  playerId: string;
  displayName: string | null;
  avatarUrl: string | null;
  vietnameseSupport: boolean;
  readingBand: 'A1' | 'A2' | 'B1' | 'B2';
  interests: ExplorationInterest[];
};

export function playerInitials(name: string | null) {
  return name?.trim().split(/\s+/u).map(part => Array.from(part)[0]).slice(0, 2).join('').toLocaleUpperCase('vi') || 'A';
}
