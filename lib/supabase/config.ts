export class SupabaseConfigurationError extends Error {
  constructor() { super('Account sign-in is temporarily unavailable. Please try again later.'); }
}
export function supabasePublicConfig() {
  // These server routes must use the running environment, including isolated
  // local test providers, rather than a public value inlined at build time.
  const url = Reflect.get(process.env, 'NEXT_PUBLIC_SUPABASE_URL') as string | undefined;
  const key = Reflect.get(process.env, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') as string | undefined;
  if (!url || !key) throw new SupabaseConfigurationError();
  try {
    const parsed = new URL(url);
    const loopback=['127.0.0.1','localhost','[::1]'].includes(parsed.hostname);
    if(parsed.username||parsed.password||!(parsed.protocol==='https:'||(parsed.protocol==='http:'&&loopback)))throw new Error();
  } catch { throw new SupabaseConfigurationError(); }
  return { url, key };
}
