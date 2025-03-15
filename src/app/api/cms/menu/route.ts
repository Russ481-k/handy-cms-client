import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";
import { Menu } from "@/app/cms/menu/page";

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
      const menuMap = new Map();
      const rootMenus: Menu[] = [];

      // 모든 메뉴를 맵에 저장
      (menus as any[]).forEach((menu) => {
        menuMap.set(menu.id, { ...menu, children: [] });
      });

      // 계층 구조 구성
      (menus as any[]).forEach((menu) => {
        const menuWithChildren = menuMap.get(menu.id);
        if (menu.parent_id) {
          const parent = menuMap.get(menu.parent_id);
          if (parent) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(menuWithChildren);
          }
        } else {
          rootMenus.push(menuWithChildren);
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
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();

    // 메뉴 생성
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO menus (
          name, type, url, target_id, display_position, 
          visible, sort_order, parent_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name || "",
          data.type || "",
          data.url || "",
          data.targetId || "",
          data.displayPosition || "",
          data.visible || "",
          data.sortOrder || "",
          data.parentId || "",
        ]
      );

      const [newMenu] = (await connection.execute(
        "SELECT * FROM menus WHERE id = ?",
        [(result as any).insertId]
      )) as [any[], any];

      return NextResponse.json(newMenu[0], { status: 201 });
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

// PUT /api/cms/menu
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

    // 메뉴 수정
    const connection = await pool.getConnection();
    try {
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
          data.name,
          data.type,
          data.url,
          data.targetId,
          data.displayPosition,
          data.visible,
          data.sortOrder,
          data.parentId || null,
          data.id,
        ]
      );

      const [updatedMenu] = (await connection.execute(
        "SELECT * FROM menus WHERE id = ?",
        [data.id]
      )) as [any[], any];

      return NextResponse.json(updatedMenu[0]);
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
