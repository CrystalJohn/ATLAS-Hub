import type { AtlasState } from './contracts/expedition';

export class AtlasApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function atlasApi<T = AtlasState>(path: string, data?: unknown): Promise<T> {
  const isMutation = data !== undefined;
  const response = await fetch(`/api/${path}`, {
    method: isMutation ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(20000),
    ...(isMutation ? { body: JSON.stringify(data) } : {}),
  });

  const body = await response.json() as T & { message?: string; code?: string };
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('atlas:sign-in-required'));
    }
    throw new AtlasApiError(response.status, body.message ?? 'We could not save that action. Please try again.', body.code);
  }

  if (isMutation && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('atlas:study-updated'));
  }
  return body;
}
