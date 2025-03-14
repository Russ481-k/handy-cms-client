import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// This is a mock authentication endpoint
// In a real application, you would validate credentials against a database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock authentication - in a real app, you would check against a database
    // For demo purposes, we'll accept any email with a password of "password123"
    if (password !== "password123") {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a mock JWT token
    // In a real app, you would use a proper JWT library
    const token = `mock-jwt-token-${Date.now()}`;

    // Set the token in a cookie for the middleware to use
    cookies().set({
      name: "cms_auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return the token and user info
    return NextResponse.json({
      token,
      user: {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
