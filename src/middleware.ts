import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Try to extract the token from cookies/session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // List of routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/editor",
    "/your-profile",
    "/post/create",
  ];

  const { pathname } = req.nextUrl;

  // Check if user is trying to access a protected route
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    // Redirect unauthenticated users to sign-in page
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url); // Optional: redirect back after login
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
    "/your-profile/:path*",
    "/post/create",
  ],
};
