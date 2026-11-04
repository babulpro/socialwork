const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mysocial-omega.vercel.app/api';

/**
 * Helper to get the saved token from localStorage (client-side only)
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Helper to store the token in localStorage
 */
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Helper to remove the token from localStorage
 */
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Unified fetch wrapper that automatically attaches authorization header
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token || getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Check if server set a new token on response headers
  const authHeader = res.headers.get('authorization') || res.headers.get('x-auth-token');
  if (authHeader) {
    const extractedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (extractedToken) setToken(extractedToken);
  }

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
