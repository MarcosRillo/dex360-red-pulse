import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@red-pulse/contracts";

// Optimistic check only: it looks at whether the cookie exists, never at whether it is valid.
// The API is the authority; an invalid or expired session is rejected there with a 401.
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // `?reason=expired` is set when the API rejected the cookie. Letting it through avoids a
  // /login -> /dashboard -> /login loop while the stale cookie is still in the browser.
  if (pathname === "/login" && hasSession && searchParams.get("reason") !== "expired") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
