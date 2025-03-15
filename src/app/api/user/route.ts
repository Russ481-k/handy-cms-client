import { NextResponse } from "next/server";

// 임시 사용자 데이터 (실제 구현에서는 데이터베이스에서 가져옵니다)
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastLoginAt: "2024-03-20T10:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    username: "editor",
    email: "editor@example.com",
    role: "EDITOR",
    status: "ACTIVE",
    lastLoginAt: "2024-03-19T15:30:00Z",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-03-19T15:30:00Z",
  },
  {
    id: 3,
    username: "user",
    email: "user@example.com",
    role: "USER",
    status: "ACTIVE",
    lastLoginAt: "2024-03-18T09:15:00Z",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-03-18T09:15:00Z",
  },
];

export async function GET() {
  try {
    // 실제 구현에서는 데이터베이스에서 사용자 목록을 가져옵니다.
    // const connection = await pool.getConnection();
    // try {
    //   const [rows] = await connection.execute("SELECT * FROM users");
    //   return NextResponse.json(rows);
    // } finally {
    //   connection.release();
    // }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 실제 구현에서는 데이터베이스에 사용자를 저장합니다.
    // const connection = await pool.getConnection();
    // try {
    //   const [result] = await connection.execute(
    //     "INSERT INTO users (username, email, role, status) VALUES (?, ?, ?, ?)",
    //     [data.username, data.email, data.role, data.status]
    //   );
    //   return NextResponse.json({ success: true, id: result.insertId });
    // } finally {
    //   connection.release();
    // }

    // 임시 구현: 새 사용자 객체 생성
    const newUser = {
      id: users.length + 1,
      ...data,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // 실제 구현에서는 데이터베이스에서 사용자를 업데이트합니다.
    // const connection = await pool.getConnection();
    // try {
    //   await connection.execute(
    //     "UPDATE users SET username = ?, email = ?, role = ?, status = ? WHERE id = ?",
    //     [data.username, data.email, data.role, data.status, data.id]
    //   );
    //   return NextResponse.json({ success: true });
    // } finally {
    //   connection.release();
    // }

    // 임시 구현: 사용자 객체 업데이트
    const userIndex = users.findIndex((u) => u.id === data.id);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
