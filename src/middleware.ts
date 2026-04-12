import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Hostnames that should serve the /math route tree without changing the URL bar. */
const MATH_HOSTS = new Set(["math.ashifdesigns.com", "math.localhost"]);

function isMathHost(host: string): boolean {
  const hostOnly = host.split(":")[0]?.toLowerCase() ?? "";
  return MATH_HOSTS.has(hostOnly);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isMathHost(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel")
  ) {
    return NextResponse.next();
  }

  if (/\.(ico|png|jpg|jpeg|svg|gif|webp|txt|xml|pdf|webmanifest)$/i.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/math")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/math" : `/math${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
