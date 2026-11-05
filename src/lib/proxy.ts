import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://mysocial-omega.vercel.app/api';

export interface ProxyOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean;
  forwardSession?: boolean;
  headers?: Record<string, string>;
}

/**
 * Universal backend proxy utility for Next.js App Router.
 * Automatically handles:
 * - Better Auth session extraction and forwarding (x-user-id, x-user-email, x-user-name)
 * - Cookie propagation
 * - JSON body serialization
 * - Unified error handling
 */
export async function proxyToBackend(
  endpoint: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const {
    method = 'GET',
    body,
    requireAuth = false,
    forwardSession = true,
    headers: customHeaders = {},
  } = options;

  let session = null;
  const reqHeaders = await headers();

  if (forwardSession || requireAuth) {
    try {
      session = await auth.api.getSession({ headers: reqHeaders });
    } catch (e) {
      console.warn('[proxy] Could not extract session:', e);
    }

    if (requireAuth && !session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${BACKEND_URL}${cleanEndpoint}`;

  const forwardHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    cookie: cookieHeader,
    ...customHeaders,
  };

  if (session?.user) {
    forwardHeaders['x-user-id'] = session.user.id;
    if (session.user.email) forwardHeaders['x-user-email'] = session.user.email;
    if (session.user.name) forwardHeaders['x-user-name'] = session.user.name;
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error(`[proxy] Error proxying ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Cannot reach backend server',
        error: error.message,
      },
      { status: 502 }
    );
  }
}

/**
 * Handle incoming Next.js Request and proxy to the backend Express route.
 */
export async function handleProxyRequest(
  req: Request,
  backendPath: string,
  options: { requireAuth?: boolean } = {}
): Promise<NextResponse> {
  const method = req.method;
  let body = undefined;

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await req.json();
    } catch {
      // Body may be empty
    }
  }

  const url = new URL(req.url);
  const search = url.search;
  const fullPath = `${backendPath}${search}`;

  return proxyToBackend(fullPath, {
    method,
    body,
    requireAuth: options.requireAuth,
  });
}
