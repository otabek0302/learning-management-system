import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && role !== "admin") {
    // Redirect to home page with access denied parameter
    const url = new URL("/", request.url);
    url.searchParams.set("access", "denied");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};