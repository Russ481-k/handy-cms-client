import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import { getTokenFromRequest } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const user = verifyToken(token);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
