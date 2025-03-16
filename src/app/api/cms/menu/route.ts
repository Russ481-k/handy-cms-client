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

// GET /api/cms/menu
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

    // 메뉴 목록 조회
    const connection = await pool.getConnection();
    try {
      const [menus] = await connection.execute(`
        SELECT * FROM menus 
        ORDER BY sort_order ASC
      `);

      // 계층 구조로 변환
      const menuMap = new Map<number, Menu>();
      const rootMenus: Menu[] = [];

      // 모든 메뉴를 맵에 저장
      (menus as MenuRow[]).forEach((menu) => {
        menuMap.set(menu.id, {
          id: menu.id,
          name: menu.name,
          type: menu.type as Menu["type"],
          url: menu.url || undefined,
          targetId: menu.target_id || undefined,
          displayPosition: menu.display_position,
          visible: menu.visible === 1,
          sortOrder: menu.sort_order,
          parentId: menu.parent_id || undefined,
          children: [],
          createdAt: menu.created_at,
          updatedAt: menu.updated_at,
        });
      });

      // 계층 구조 구성
      (menus as MenuRow[]).forEach((menu) => {
        const menuWithChildren = menuMap.get(menu.id);
        if (menu.parent_id) {
          const parent = menuMap.get(menu.parent_id);
          if (parent && menuWithChildren) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(menuWithChildren);
          }
        } else {
          if (menuWithChildren) {
            rootMenus.push(menuWithChildren);
          }
        }
      });

      return NextResponse.json(rootMenus);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cms/menu
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

    // 메뉴 생성
    const connection = await pool.getConnection();
    try {
      // 부모 메뉴가 있는 경우, 해당 부모의 자식들 중 가장 큰 sort_order + 1
      // 부모 메뉴가 없는 경우, 전체 메뉴 중 가장 큰 sort_order + 1
      let nextSortOrder = 1;
      if (data.parentId) {
        const [siblings] = await connection.execute(
          "SELECT MAX(sort_order) as max_sort_order FROM menus WHERE parent_id = ?",
          [data.parentId]
        );
        nextSortOrder =
          ((siblings as { max_sort_order: number }[])[0]?.max_sort_order || 0) +
          1;
      } else {
        const [rootMenus] = await connection.execute(
          "SELECT MAX(sort_order) as max_sort_order FROM menus WHERE parent_id IS NULL"
        );
        nextSortOrder =
          ((rootMenus as { max_sort_order: number }[])[0]?.max_sort_order ||
            0) + 1;
      }

      const [result] = await connection.execute(
        `INSERT INTO menus (
          name, type, url, target_id, display_position, 
          visible, sort_order, parent_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name || "",
          data.type || "",
          data.url || null,
          data.targetId || null,
          data.displayPosition || "",
          data.visible ? 1 : 0,
          nextSortOrder,
          data.parentId || null,
        ]
      );

      const [newMenu] = await connection.execute(
        "SELECT * FROM menus WHERE id = ?",
        [(result as { insertId: number }).insertId]
      );

      const menuRow = (newMenu as MenuRow[])[0];
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

      return NextResponse.json(menu, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/menu
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Menu ID is required" },
        { status: 400 }
      );
    }

    // 메뉴 삭제
    const connection = await pool.getConnection();
    try {
      await connection.execute("DELETE FROM menus WHERE id = ?", [id]);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
