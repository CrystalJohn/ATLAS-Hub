import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '../../../lib/supabase/server';
import { supabasePublicConfig } from '../../../lib/supabase/config';
import { trustedAuthOrigin } from '../../../lib/atlas/origin';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  let origin: string;
  try { origin = trustedAuthOrigin(request); }
  catch { return Response.json({ message: 'This sign-in address is unavailable.' }, { status: 400 }); }
  try {
    const { url, key } = supabasePublicConfig();
    const settings = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!settings.ok) throw new Error('Auth unavailable');
    const capabilities = await settings.json() as { external?: { google?: boolean } };
    if (!capabilities.external?.google) return NextResponse.redirect(new URL('/auth/error?reason=unavailable', origin));
    const client = await supabaseRouteClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback`, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
    });
    if (!error && data.url) return NextResponse.redirect(data.url, { headers: { 'Cache-Control': 'no-store' } });
  } catch { /* The error page never renders provider errors or token values. */ }
  return NextResponse.redirect(new URL('/auth/error', origin));
}
