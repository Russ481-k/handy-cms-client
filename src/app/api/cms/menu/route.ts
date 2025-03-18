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
    console.log("Auth header received:", authHeader?.substring(0, 20) + "...");
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

    // URL에서 type 파라미터 추출
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    console.log("Requested menu type:", type);

    // 데이터베이스 연결
    const connection = await pool.getConnection();
    try {
      // 메뉴 목록 조회 (type이 지정된 경우 필터링)
      const query = type
        ? type === "BOARD" || type === "CONTENT"
          ? "SELECT * FROM menus WHERE type = ? ORDER BY sort_order ASC"
          : `
            WITH RECURSIVE menu_tree AS (
              -- 타입이 일치하는 메뉴 선택
              SELECT * FROM menus WHERE type = ?
              UNION
              -- 부모 메뉴들 추가
              SELECT m.* 
              FROM menus m
              INNER JOIN menu_tree mt ON m.id = mt.parent_id
            )
            SELECT * FROM menu_tree
            ORDER BY sort_order ASC
          `
        : "SELECT * FROM menus ORDER BY sort_order ASC";
      const params = type ? [type] : [];
      console.log("Executing query for type:", type);
      console.log("Query:", query.replace(/\s+/g, " "));
      console.log("Parameters:", params);

      // 데이터베이스 상태 확인
      const [menuTypes] = await connection.execute(
        "SELECT type, COUNT(*) as count FROM menus GROUP BY type"
      );
      console.log("Available menu types in database:", menuTypes);

      const [menus] = await connection.execute(query, params);
      console.log("Query result count:", (menus as any[]).length);
      if (type === "CONTENT") {
        console.log("Content menus found:", menus);
      }

      // 계층 구조로 변환
      const menuMap = new Map<number, Menu>();
      const rootMenus: Menu[] = [];

      // 모든 메뉴를 맵에 저장하고, BOARD/CONTENT 타입인 경우 바로 rootMenus에 추가
      (menus as MenuRow[]).forEach((menu) => {
        const menuItem: Menu = {
          id: menu.id,
          name: menu.name,
          type: menu.type as Menu["type"],
          url: menu.url || undefined,
          targetId: menu.target_id || undefined,
          displayPosition: menu.display_position,
          visible: menu.visible === 1,
          sortOrder: menu.sort_order,
          parentId: menu.parent_id || undefined,
          children: [], // 항상 배열로 초기화
          createdAt: menu.created_at,
          updatedAt: menu.updated_at,
        };

        if (type === "BOARD" || type === "CONTENT") {
          rootMenus.push(menuItem);
        } else {
          menuMap.set(menu.id, menuItem);
        }
      });

      // BOARD/CONTENT가 아닌 경우에만 계층 구조 구성
      if (type !== "BOARD" && type !== "CONTENT") {
        menuMap.forEach((menu) => {
          if (menu.parentId) {
            const parent = menuMap.get(menu.parentId);
            if (parent && Array.isArray(parent.children)) {
              parent.children.push(menu);
            }
          } else {
            rootMenus.push(menu);
          }
        });

        // 각 메뉴의 children 배열이 비어있는지 확인하고 정렬
        const finalizeMenu = (menu: Menu): Menu => {
          if (Array.isArray(menu.children)) {
            if (menu.children.length === 0) {
              menu.children = undefined; // 자식이 없는 경우 undefined로 설정
            } else {
              menu.children.sort((a, b) => a.sortOrder - b.sortOrder);
              menu.children.forEach(finalizeMenu);
            }
          }
          return menu;
        };

        rootMenus.forEach(finalizeMenu);
      }

      rootMenus.sort((a, b) => a.sortOrder - b.sortOrder);

      console.log("Final response:", rootMenus);
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
