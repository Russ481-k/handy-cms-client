import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";
import { Menu } from "@/app/cms/menu/page";

interface MenuRow {
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

// PUT /api/cms/menu/[id]
export async function PUT(
  request: Request,
  context: { params: { id: string } }
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
    const params = await context.params;
    const id = params.id;

    // 메뉴 수정
    const connection = await pool.getConnection();
    try {
      // 기존 메뉴 정보 조회
      const [existingMenu] = await connection.execute(
        "SELECT * FROM menus WHERE id = ?",
        [id]
      );

      if (!(existingMenu as MenuRow[])[0]) {
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
          data.name || (existingMenu as MenuRow[])[0].name,
          data.type || (existingMenu as MenuRow[])[0].type,
          data.url || null,
          data.targetId || null,
          data.displayPosition ||
            (existingMenu as MenuRow[])[0].display_position,
          data.visible ?? (existingMenu as MenuRow[])[0].visible,
          data.sortOrder || (existingMenu as MenuRow[])[0].sort_order,
          data.parentId || (existingMenu as MenuRow[])[0].parent_id,
          id,
        ]
      );

      const [updatedMenu] = await connection.execute(
        "SELECT * FROM menus WHERE id = ?",
        [id]
      );

      const menuRow = (updatedMenu as MenuRow[])[0];
      const menu: Menu = {
        id: menuRow.id,
        name: menuRow.name,
        type: menuRow.type as Menu["type"],
        url: menuRow.url || undefined,
        targetId: menuRow.target_id || undefined,
        displayPosition: menuRow.display_position,
        visible: menuRow.visible === 1,
        sortOrder: menuRow.sort_order,
        parentId: menuRow.parent_id || undefined,
        children: [],
        createdAt: menuRow.created_at,
        updatedAt: menuRow.updated_at,
      };

      return NextResponse.json(menu);
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
