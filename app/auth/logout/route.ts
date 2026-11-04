import { NextResponse } from 'next/server';
import { supabaseRouteClient } from '../../../lib/supabase/server';
import { trustedAuthOrigin, sameOrigin } from '../../../lib/atlas/origin';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  let origin: string;
  try { origin = trustedAuthOrigin(request); }
  catch { return Response.json({ message: 'This sign-out address is unavailable.' }, { status: 400 }); }
  if (!sameOrigin(request)) return Response.json({ message: 'Cross-origin request rejected.' }, { status: 403 });
  try {
    const client = await supabaseRouteClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (!error) return NextResponse.redirect(new URL('/', origin), { status: 303, headers: { 'Cache-Control': 'no-store' } });
  } catch { /* Keep the current session visible when sign-out cannot complete. */ }
  return NextResponse.redirect(new URL('/auth/error', origin), 303);
}
