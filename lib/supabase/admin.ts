import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabasePublicConfig, SupabaseConfigurationError } from './config';

/** Server route handlers only. Never expose this client to browser code. */
export function supabaseAdmin() {
  const { url } = supabasePublicConfig();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new SupabaseConfigurationError();
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
