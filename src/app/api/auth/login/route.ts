import { NextResponse } from "next/server";
import { validateUser, generateToken } from "@/lib/auth-utils";

// This is a mock authentication endpoint
// In a real application, you would validate credentials against a database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Simple validation
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Validate user against database
    const user = await validateUser(username, password);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return the token and user info
    return NextResponse.json({
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
