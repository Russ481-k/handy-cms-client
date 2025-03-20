import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";
import { User } from "@/app/cms/user/page";

interface UserRow {
  uuid: string;
  username: string;
  email: string;
  role: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// PUT /api/cms/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token);
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();
    const { id } = await params;

    // 사용자 수정
    const connection = await pool.getConnection();
    try {
      // 기존 사용자 정보 조회
      const [existingUser] = await connection.execute(
        "SELECT * FROM users WHERE uuid = ?",
        [id]
      );

      if (!(existingUser as UserRow[])[0]) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      await connection.execute(
        `UPDATE users SET
          username = ?,
          email = ?,
          role = ?,
          status = ?,
          updated_at = NOW()
        WHERE uuid = ?`,
        [
          data.username || (existingUser as UserRow[])[0].username,
          data.email || (existingUser as UserRow[])[0].email,
          data.role || (existingUser as UserRow[])[0].role,
          data.status || (existingUser as UserRow[])[0].status,
          id,
        ]
      );

      const [updatedUser] = await connection.execute(
        "SELECT * FROM users WHERE uuid = ?",
        [id]
      );

      const userRow = (updatedUser as UserRow[])[0];
      const user: User = {
        id: userRow.uuid,
        username: userRow.username,
        email: userRow.email,
        role: userRow.role as User["role"],
        status: userRow.status as User["status"],
        lastLoginAt: userRow.last_login_at || undefined,
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      };

      return NextResponse.json(user);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
      verifyToken(token);
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    // 사용자 삭제
    const connection = await pool.getConnection();
    try {
      // 기존 사용자 정보 조회
      const [existingUser] = await connection.execute(
        "SELECT * FROM users WHERE uuid = ?",
        [id]
      );

      if (!(existingUser as UserRow[])[0]) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      await connection.execute("DELETE FROM users WHERE uuid = ?", [id]);

      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
