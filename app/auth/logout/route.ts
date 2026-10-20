import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '../../../lib/supabase/server';
import { requestOrigin, sameOrigin } from '../../../lib/atlas/origin';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const origin = requestOrigin(request);
  if (!sameOrigin(request)) return Response.json({ message: 'Cross-origin request rejected.' }, { status: 403 });
  try {
    const client = await supabaseRouteClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (!error) return NextResponse.redirect(new URL('/', origin), { status: 303, headers: { 'Cache-Control': 'no-store' } });
  } catch { /* Keep the current session visible when sign-out cannot complete. */ }
  return NextResponse.redirect(new URL('/auth/error', origin), 303);
}
