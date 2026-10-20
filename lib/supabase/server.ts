import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabasePublicConfig } from './config';

/** Route handlers only: session refresh cookies are written onto their response. */
export async function supabaseRouteClient() {
  const { url, key } = supabasePublicConfig();
  const jar = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (items) => { for (const { name, value, options } of items) jar.set(name, value, options); },
    },
  });
}
