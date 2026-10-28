import type { SupabaseClient, User } from '@supabase/supabase-js';
import { handleAtlasForPlayer } from './service.ts';
import { supabaseExpeditionStore } from './supabase-storage.ts';
import { SupabaseConfigurationError } from '../supabase/config.ts';
import { sameOrigin } from './origin.ts';
import { handlePlayerProfile } from './profile-handler.ts';
import {ensurePlayer} from './player.ts';
import {StorageUnavailable} from './storage.ts';
import {handleTower,type TowerRuntime} from './tower-handlers.ts';

type Dependencies = { getUser: () => Promise<User | null>; getAdmin: () => SupabaseClient; towerTestRuntime?:TowerRuntime };
const json = (body: object, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' },
});
export async function handleVercelAtlas(request: Request, deps: Dependencies): Promise<Response> {
  try {
    const url = new URL(request.url);
    if (request.method === 'POST' && !sameOrigin(request)) return json({ message: 'Cross-origin request rejected.' }, 403);
    if (url.pathname === '/api/health' && request.method === 'GET') {
      // A zero-row GET retains PostgREST's missing-schema error body; HEAD can
      // normalize an empty 404 into a successful empty result in the client.
      const client=deps.getAdmin();
      const probes=await Promise.all([client.from('atlas_expeditions').select('player_id,revision').limit(0),client.from('atlas_profiles').select('player_id,interests').limit(0)]);
      const error=probes.find(result=>result.error)?.error;
      return error ? json({ ok: false, code: ['PGRST205', '42P01'].includes(error.code) ? 'DATABASE_SETUP_REQUIRED' : 'STORAGE_UNAVAILABLE' }, 503) : json({ ok: true, persistence: 'supabase' });
    }
    // Never use OAI headers, a request body ID, or an email as Google identity.
    const user = await deps.getUser();
    if (!user || user.is_anonymous || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)) {
      return json({ message: 'Sign in with Google to start or resume your adventure.', code: 'SIGN_IN_REQUIRED' }, 401);
    }
    if(['playerId','player_id','userId','user_id'].some(key=>url.searchParams.has(key)))return json({message:'Player selectors are not accepted.'},400);
    const admin=deps.getAdmin();
    if(url.pathname==='/api/session'&&request.method==='POST')await ensurePlayer(admin,user.id);
    const response = url.pathname === '/api/profile'
      ? await handlePlayerProfile(request, admin, user)
      : url.pathname==='/api/tower'||url.pathname.startsWith('/api/tower/')
       ? await handleTower(request,supabaseExpeditionStore(admin),user.id,deps.towerTestRuntime)
       : await handleAtlasForPlayer(request, supabaseExpeditionStore(admin), user.id);
    response.headers.set('Cache-Control', 'no-store, private');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  } catch (error) {
    return json({ message: error instanceof SupabaseConfigurationError ? error.message : 'Your account is temporarily unavailable. Please try again shortly.', code: error instanceof SupabaseConfigurationError ? 'ACCOUNT_CONFIGURATION_REQUIRED' : error instanceof StorageUnavailable&&['PGRST205','42P01'].includes(error.code)?'PROFILE_SETUP_REQUIRED':'ACCOUNT_UNAVAILABLE' }, 503);
  }
}
