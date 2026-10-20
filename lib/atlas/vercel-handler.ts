import type { SupabaseClient, User } from '@supabase/supabase-js';
import { handleAtlasForPlayer } from './service.ts';
import { supabaseExpeditionStore } from './supabase-storage.ts';
import { SupabaseConfigurationError } from '../supabase/config.ts';
import { sameOrigin } from './origin.ts';

type Dependencies = { getUser: () => Promise<User | null>; getAdmin: () => SupabaseClient };
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
      const { error } = await deps.getAdmin().from('atlas_expeditions').select('player_id').limit(0);
      return error ? json({ ok: false, code: ['PGRST205', '42P01'].includes(error.code) ? 'DATABASE_SETUP_REQUIRED' : 'STORAGE_UNAVAILABLE' }, 503) : json({ ok: true, persistence: 'supabase' });
    }
    // Never use OAI headers, a request body ID, or an email as Google identity.
    const user = await deps.getUser();
    if (!user || user.is_anonymous || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)) {
      return json({ message: 'Sign in with Google to start or resume your adventure.', code: 'SIGN_IN_REQUIRED' }, 401);
    }
    const response = await handleAtlasForPlayer(request, supabaseExpeditionStore(deps.getAdmin()), user.id);
    response.headers.set('Cache-Control', 'no-store, private');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  } catch (error) {
    return json({ message: error instanceof SupabaseConfigurationError ? error.message : 'Your account is temporarily unavailable. Please try again shortly.', code: error instanceof SupabaseConfigurationError ? 'ACCOUNT_CONFIGURATION_REQUIRED' : 'ACCOUNT_UNAVAILABLE' }, 503);
  }
}
