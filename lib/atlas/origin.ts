/** Use HTTP Host, never a caller-supplied forwarded host, for browser origin checks. */
export function requestOrigin(request: Request): string {
  const host = (request.headers.get('host') ?? new URL(request.url).host).toLowerCase();
  const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const localHttp = process.env.NODE_ENV !== 'production' && new URL(request.url).protocol === 'http:';
  const result = new URL(`${loopback || localHttp ? 'http' : 'https'}://${host}`);
  if (result.host !== host || result.username || result.password || result.pathname !== '/') throw new Error('Invalid request host');
  return result.origin;
}
export function sameOrigin(request: Request): boolean {
  try {
    const origin = request.headers.get('origin');
    return !!origin && new URL(origin).origin === requestOrigin(request);
  } catch { return false; }
}
