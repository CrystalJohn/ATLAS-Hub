/** Use HTTP Host, never a caller-supplied forwarded host, for browser origin checks. */
export function requestOrigin(request: Request): string {
  const host = (request.headers.get('host') ?? new URL(request.url).host).toLowerCase();
  const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const localHttp = process.env.NODE_ENV !== 'production' && new URL(request.url).protocol === 'http:';
  const result = new URL(`${loopback || localHttp ? 'http' : 'https'}://${host}`);
  if (result.host !== host || result.username || result.password || result.pathname !== '/') throw new Error('Invalid request host');
  return result.origin;
}
/** OAuth and logout redirects must never inherit an unapproved public Host. */
export function trustedAuthOrigin(request: Request): string {
  const origin = requestOrigin(request);
  const loopback = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  if (loopback && process.env.NODE_ENV !== 'production') return origin;
  const configured = (process.env.ATLAS_AUTH_ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean);
  if (configured.some(value => {
    try { const parsed = new URL(value); return (parsed.protocol === 'https:' || (loopback && parsed.protocol === 'http:')) && parsed.origin === value && value === origin; }
    catch { return false; }
  })) return origin;
  throw new Error('Unapproved authentication origin');
}
export function sameOrigin(request: Request): boolean {
  try {
    const origin = request.headers.get('origin');
    return !!origin && new URL(origin).origin === requestOrigin(request);
  } catch { return false; }
}
