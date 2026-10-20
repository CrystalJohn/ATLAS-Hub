import type { SupabaseClient, User } from '@supabase/supabase-js';
import { z } from 'zod';
import { profilePatch, type PlayerProfile } from './profile.ts';
import {interestIds} from '../../content/interests.ts';

function avatarFor(user: User): string | null {
  const raw = user.user_metadata?.avatar_url;
  if (typeof raw !== 'string') return null;
  try { const url = new URL(raw); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}

/** The caller verifies the session and origin. Never accept a player ID from the client. */
export async function handlePlayerProfile(request: Request, client: SupabaseClient, user: User) {
  const json = (body: object, status = 200) => Response.json(body, { status });
  try {
    if (request.method !== 'GET' && request.method !== 'POST') return json({ message: 'Method not allowed.' }, 405);
    let query;
    if (request.method === 'POST') {
      const raw = await request.text();
      if (raw.length > 2048) return json({ message: 'Profile update is too large.' }, 413);
      let body: unknown;
      try { body = JSON.parse(raw); } catch { return json({ message: 'Invalid profile update.' }, 400); }
      const patch = profilePatch.parse(body);
      // Only supplied columns change. This table never contains progression data.
      query = client.from('atlas_profiles').upsert({
        player_id: user.id,
        ...(patch.displayName !== undefined ? { display_name: patch.displayName } : {}),
        ...(patch.vietnameseSupport !== undefined ? { vietnamese_support: patch.vietnameseSupport } : {}),
        ...(patch.readingBand !== undefined ? { reading_band: patch.readingBand } : {}),
        ...(patch.interests !== undefined ? { interests: patch.interests } : {}),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'player_id', defaultToNull: false }).select('*').single();
    } else {
      // Reading old rows remains compatible before the additive interests migration.
      query = client.from('atlas_profiles').select('*').eq('player_id', user.id).maybeSingle();
    }
    const { data, error } = await query;
    if(error&&['PGRST204','42703'].includes(error.code))return json({message:'Your interests could not be saved yet. Your choices are kept; please try again later.',code:'PROFILE_SCHEMA_UPDATE_REQUIRED'},503);
    if (error) return json({ message: 'Your profile could not be loaded or saved. Please try again.', code: ['PGRST205', '42P01'].includes(error.code) ? 'PROFILE_SETUP_REQUIRED' : 'PROFILE_UNAVAILABLE' }, 503);
    const profile: PlayerProfile = {
      playerId: user.id, displayName: data?.display_name ?? null, avatarUrl: avatarFor(user),
      vietnameseSupport: data?.vietnamese_support ?? true, readingBand: data?.reading_band ?? 'A2',
      interests: Array.isArray(data?.interests)?interestIds.filter(id=>data.interests.includes(id)):[],
    };
    return json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) return json({ message: error.issues[0]?.message ?? 'Invalid profile update.' }, 400);
    throw error;
  }
}
