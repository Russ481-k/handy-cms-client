import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";
import { Menu } from "@/app/cms/menu/page";
import type { RowDataPacket } from "mysql2";

interface MenuRow extends RowDataPacket {
  id: number;
  name: string;
  type: string;
  url: string | null;
  target_id: number | null;
  display_position: string;
  visible: number;
  sort_order: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

function convertToMenu(row: MenuRow): Menu {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Menu["type"],
    url: row.url || undefined,
    targetId: row.target_id || undefined,
    displayPosition: row.display_position,
    visible: row.visible === 1,
    sortOrder: row.sort_order,
    parentId: row.parent_id || undefined,
    children: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

    // 메뉴 수정
    const connection = await pool.getConnection();
    try {
      // 기존 메뉴 정보 조회
      const [rows] = await connection.execute<MenuRow[]>(
        "SELECT * FROM menus WHERE id = ?",
        [id]
      );

      const existingMenu = rows[0];
      if (!existingMenu) {
        return NextResponse.json(
          { message: "Menu not found" },
          { status: 404 }
        );
      }

      await connection.execute(
        `UPDATE menus SET
          name = ?,
          type = ?,
          url = ?,
          target_id = ?,
          display_position = ?,
          visible = ?,
          sort_order = ?,
          parent_id = ?
        WHERE id = ?`,
        [
          data.name || existingMenu.name,
          data.type || existingMenu.type,
          data.url || null,
          data.targetId || null,
          data.displayPosition || existingMenu.display_position,
          data.visible ?? existingMenu.visible,
          data.sortOrder || existingMenu.sort_order,
          data.parentId || existingMenu.parent_id,
          id,
        ]
      );

      const [updatedRows] = await connection.execute<MenuRow[]>(
        "SELECT * FROM menus WHERE id = ?",
        [id]
      );

      const updatedMenu = convertToMenu(updatedRows[0]);
      return NextResponse.json(updatedMenu);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
