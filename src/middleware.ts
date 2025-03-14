import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/cms/login";

  // Check if the path starts with /cms and is not a public path
  const isCmsPath = path.startsWith("/cms") && !isPublicPath;

  // Get the token from Authorization header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  // If the path requires authentication and there's no valid token, redirect to login
  if (isCmsPath) {
    if (!token) {
      const url = new URL("/cms/login", request.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }

    try {
      // Verify the token
      verify(token, JWT_SECRET);
    } catch (error) {
      // If token is invalid, redirect to login
      const url = new URL("/cms/login", request.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }
  }

  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (isPublicPath && token) {
    try {
      verify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/cms/dashboard", request.url));
    } catch (error) {
      // If token is invalid, allow access to login page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ["/cms/:path*"],
};
