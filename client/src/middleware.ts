import { NextRequest, NextResponse } from "next/server";
import { User } from "./api/user/constants";

// vars
const BASE_URL = process.env.INTERNAL_API_URL;

// route arrays
const authenticatedRoutes = ["/dashboard/*", "/logout"];
const publicRoutes = ["/", "/privacy"];
const unauthenticatedRoutes = ["/login", "/register"];

// helper functions
const matchRoute = (route: string, patterns: string[]): boolean => {
  const normalizedRoute = route.endsWith("/") ? route.slice(0, -1) : route;

  return patterns.some((pattern) => {
    const normalizedPattern = pattern.endsWith("/")
      ? pattern.slice(0, -1)
      : pattern;

    if (normalizedPattern.endsWith("/*")) {
      const prefix = normalizedPattern.slice(0, -2);
      return (
        normalizedRoute === prefix || normalizedRoute.startsWith(prefix + "/")
      );
    } else {
      return normalizedRoute === normalizedPattern;
    }
  });
};

const isAuthenticatedRoute = (path: string) =>
  matchRoute(path, authenticatedRoutes);
const isPublicRoute = (path: string) => matchRoute(path, publicRoutes);
const isUnauthenticatedRoute = (path: string) =>
  matchRoute(path, unauthenticatedRoutes);

async function validateSession(session: string): Promise<User | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        cookie: `connect.sid=${encodeURIComponent(session)}`,
      },
    });

    if (res.status === 200) {
      return await res.json();
    } else if (res.status === 401 || res.status === 403) {
      // Session is invalid or forbidden - treat as not authenticated
      return null;
    } else {
      // Any other status code is treated as an error
      console.error(`Unexpected status code from auth: ${res.status}`);
      return null; // Don't throw, just treat as unauthenticated
    }
  } catch (error) {
    console.error("Session validation error:", error);
    return null; // Don't throw, just treat as unauthenticated
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get("connect.sid")?.value;

  // Validate session if it exists
  const user = session ? await validateSession(session) : null;
  const isAuthenticated = !!user;
  const shouldDeleteSession = !!session && !user;

  let response: NextResponse;

  // Public routes accessible by anyone
  if (isPublicRoute(pathname)) {
    response = NextResponse.next();
  }
  // Authenticated routes (require login)
  else if (isAuthenticatedRoute(pathname)) {
    if (!isAuthenticated) {
      response = NextResponse.redirect(new URL("/login", request.url));
    } else {
      response = NextResponse.next();
    }
  }
  // Unauthenticated routes (login/register - require no login)
  else if (isUnauthenticatedRoute(pathname)) {
    if (isAuthenticated) {
      response = NextResponse.redirect(new URL("/", request.url));
    } else {
      response = NextResponse.next();
    }
  }
  // All other routes
  else {
    response = NextResponse.next();
  }

  // Delete invalid session cookie
  if (shouldDeleteSession) {
    // Delete invalid session cookie
    response.cookies.delete({ name: "connect.sid", path: "/" });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
