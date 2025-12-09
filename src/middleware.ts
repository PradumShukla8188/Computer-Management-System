// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // or session cookie

  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/signin", "/signup"];

  // If user is already logged in, prevent opening login page
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is NOT logged in and trying to access private routes
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

// Match all routes except static files, images, API routes etc.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
