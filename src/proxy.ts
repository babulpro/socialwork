import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy Function (Official successor to middleware)
 * Protects private pages and manages authentication redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session tokens (HTTP and HTTPS variants)
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // Protected paths that require an active session
  const protectedRoutes = ['/dashboard', '/settings', '/events/new', '/events/create'];
  const isProtected =
    protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    (pathname.startsWith('/events/') && pathname.endsWith('/edit'));

  // If user is accessing a protected route without a session, redirect to /sign-in
  if (isProtected && !sessionToken) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is already authenticated and visits sign-in or sign-up, redirect to /dashboard
  const isAuthPage =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/login' ||
    pathname === '/register';

  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, public assets
     * - api routes (handled directly by route handlers)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
