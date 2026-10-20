export class SupabaseConfigurationError extends Error {
  constructor() { super('Account sign-in is temporarily unavailable. Please try again later.'); }
}
export function supabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new SupabaseConfigurationError();
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') throw new Error();
  } catch { throw new SupabaseConfigurationError(); }
  return { url, key };
}
