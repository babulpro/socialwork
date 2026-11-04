/**
 * Unified API Client for Next.js App Router with Better-Auth support
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure endpoint starts with /api if not specified
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!cleanEndpoint.startsWith('/api')) {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  const res = await fetch(cleanEndpoint, {
    ...options,
    headers,
    credentials: 'include', // Automatically passes Better-Auth session cookies
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
