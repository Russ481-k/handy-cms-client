import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // 실제 운영에서는 반드시 환경변수로 관리

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

    // Create user object
    const user = {
      id: "1",
      email,
      name: email.split("@")[0],
      role: "admin",
    };

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
