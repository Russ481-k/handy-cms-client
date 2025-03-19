import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";
import { User } from "@/app/cms/user/page";

interface UserRow {
  uuid: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(request: Request) {
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

    // 데이터베이스 연결
    const connection = await pool.getConnection();
    try {
      // 사용자 목록 조회
      const [users] = await connection.execute(
        "SELECT * FROM users ORDER BY created_at DESC"
      );

      // UserRow를 User 타입으로 변환
      const userList = (users as UserRow[]).map((user) => ({
        id: user.uuid,
        username: user.username,
        email: user.email,
        role: user.role as User["role"],
        status: "ACTIVE", // 현재는 status 필드가 없으므로 기본값으로 설정
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      return NextResponse.json(userList);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // 데이터베이스 연결
    const connection = await pool.getConnection();
    try {
      // 사용자 생성
      const [] = await connection.execute(
        `INSERT INTO users (
          uuid,
          username,
          name,
          email,
          password,
          role,
          created_at,
          updated_at
        ) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.username,
          data.username, // name 필드에도 username을 사용
          data.email,
          "temporary_password", // 임시 비밀번호 설정
          data.role,
        ]
      );

      // UUID 조회
      const [uuidResult] = await connection.execute(
        "SELECT uuid FROM users WHERE username = ? AND email = ?",
        [data.username, data.email]
      );

      const uuid = (uuidResult as { uuid: string }[])[0].uuid;

      // 생성된 사용자 정보 조회
      const [newUser] = await connection.execute(
        "SELECT * FROM users WHERE uuid = ?",
        [uuid]
      );

      const userRow = (newUser as UserRow[])[0];
      const user: User = {
        id: userRow.uuid,
        username: userRow.username,
        email: userRow.email,
        role: userRow.role as User["role"],
        status: "ACTIVE",
        createdAt: userRow.created_at,
        updatedAt: userRow.updated_at,
      };

      return NextResponse.json(user, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
