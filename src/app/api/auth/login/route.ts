import { NextResponse } from "next/server";
import {
  validateUser,
  generateToken,
  createInitialAdmin,
} from "@/lib/auth-utils";

// 서버 시작 시 초기 admin 계정 생성
createInitialAdmin().catch(console.error);

// This is a mock authentication endpoint
// In a real application, you would validate credentials against a database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    // Simple validation
    if (!id || !password) {
      return NextResponse.json(
        { message: "ID and password are required" },
        { status: 400 }
      );
    }

    // Validate user against database
    const user = await validateUser(id, password);
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
