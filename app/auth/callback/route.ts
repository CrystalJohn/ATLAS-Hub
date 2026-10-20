import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '../../../lib/supabase/server';
import { requestOrigin } from '../../../lib/atlas/origin';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = requestOrigin(request);
  const code = url.searchParams.get('code');
  if (process.env.VERCEL === '1' && code && !url.searchParams.has('error')) {
    try {
      const client = await supabaseRouteClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL('/', origin), { headers: { 'Cache-Control': 'no-store' } });
    } catch { /* Retry sign-in from the error page; do not expose provider details. */ }
  }
  return NextResponse.redirect(new URL('/auth/error', origin));
}
