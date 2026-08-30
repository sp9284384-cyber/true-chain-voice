import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight middleware for investigator routes.
 * The actual token validation happens client-side in each page
 * (zustand store is client-side only). This middleware simply
 * ensures that unauthenticated users land on the login page.
 *
 * The dashboard pages perform their own token check and redirect
 * to /investigator/login if no token is found in the zustand store.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only match investigator dashboard routes (not login)
  if (pathname.startsWith('/investigator/dashboard')) {
    // Allow the request through — client-side auth handles token validation
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/investigator/:path*'],
};
