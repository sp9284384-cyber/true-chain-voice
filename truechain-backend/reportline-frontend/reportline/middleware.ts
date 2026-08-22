import { NextRequest, NextResponse } from "next/server";

/**
 * Gates /investigator/* routes. See lib/auth.tsx for why this checks a
 * session marker cookie rather than the (deliberately non-persistent,
 * context-only) access token — middleware runs before React does and can't
 * see component state. This only decides whether to let the page render;
 * every actual API call is still authorized by the real bearer token held
 * in AuthContext, not by this cookie.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/investigator/login";
  const isInvestigatorRoute = pathname.startsWith("/investigator");

  if (isInvestigatorRoute && !isLoginPage) {
    const hasSession = request.cookies.has("rl_session");
    if (!hasSession) {
      const loginUrl = new URL("/investigator/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investigator/:path*"],
};
