import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "tc_investigator_token";
const PUBLIC_INVESTIGATOR_PATHS = ["/investigator/login"];

// Single place that decides who can reach decrypted report content.
// Everything under /investigator/* requires the session cookie set by
// lib/auth.tsx on successful login, except the login page itself.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_INVESTIGATOR_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/investigator/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investigator/:path*"],
};
