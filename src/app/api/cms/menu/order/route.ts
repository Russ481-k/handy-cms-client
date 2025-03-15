import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";

// PUT /api/cms/menu/order
export async function PUT(request: Request) {
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
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();
    const { menuOrders } = data;

    if (!Array.isArray(menuOrders)) {
      return NextResponse.json(
        { message: "Menu orders must be an array" },
        { status: 400 }
      );
    }

    // 메뉴 순서 업데이트
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const { id, sortOrder } of menuOrders) {
        await connection.execute(
          "UPDATE menus SET sort_order = ? WHERE id = ?",
          [sortOrder, id]
        );
      }

      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating menu order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
