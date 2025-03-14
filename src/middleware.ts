import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/cms/login";

  // Check if the path starts with /cms and is not a public path
  const isCmsPath = path.startsWith("/cms") && !isPublicPath;

  // Get the token from cookies
  const token = request.cookies.get("cms_auth_token")?.value || "";

  // If the path requires authentication and there's no token, redirect to login
  if (isCmsPath && !token) {
    const url = new URL("/cms/login", request.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/cms/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ["/cms/:path*"],
};
