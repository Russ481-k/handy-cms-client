import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";

interface MenuOrder {
  id: number;
  targetId: number;
  position: "before" | "after" | "inside";
}

interface Menu {
  id: number;
  parent_id: number | null;
  sort_order: number;
  path: string;
}

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
      console.error("Error verifying token:", error);
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

      // 1. 모든 메뉴의 현재 정보 조회 (계층 구조 포함)
      const [menus] = await connection.execute(`
        WITH RECURSIVE menu_tree AS (
          -- 루트 메뉴 선택
          SELECT 
            id,
            parent_id,
            sort_order,
            CAST(id AS CHAR(200)) as path
          FROM menus
          WHERE parent_id IS NULL
          
          UNION ALL
          
          -- 자식 메뉴 선택
          SELECT 
            m.id,
            m.parent_id,
            m.sort_order,
            CONCAT(mt.path, ',', m.id)
          FROM menus m
          INNER JOIN menu_tree mt ON m.parent_id = mt.id
        )
        SELECT * FROM menu_tree
        ORDER BY path, sort_order
      `);

      const menuMap = new Map((menus as Menu[]).map((menu) => [menu.id, menu]));

      // 2. 각 메뉴 이동 처리
      for (const { id, targetId, position } of menuOrders as MenuOrder[]) {
        const currentMenu = menuMap.get(id);
        const targetMenu = menuMap.get(targetId);

        if (!currentMenu || !targetMenu) {
          throw new Error(`Menu not found: id=${id}, targetId=${targetId}`);
        }

        // 3. 새로운 parent_id 결정
        let newParentId = currentMenu.parent_id;
        if (position === "inside") {
          newParentId = targetId;
        }

        // 4. 메뉴 맵에서 현재 메뉴 제거
        menuMap.delete(id);

        // 5. 새로운 위치에 메뉴 삽입
        const menuArray = Array.from(menuMap.values());
        const targetIndex = menuArray.findIndex((menu) => menu.id === targetId);

        // 6. 새로운 메뉴 객체 생성
        const newMenu: Menu = {
          ...currentMenu,
          parent_id: newParentId,
          path:
            position === "inside"
              ? `${targetMenu.path},${id}`
              : currentMenu.path,
        };

        // 7. 적절한 위치에 메뉴 삽입
        if (position === "before") {
          menuArray.splice(targetIndex, 0, newMenu);
        } else if (position === "after") {
          menuArray.splice(targetIndex + 1, 0, newMenu);
        }

        // 8. 메뉴 맵 업데이트
        menuMap.clear();
        menuArray.forEach((menu) => menuMap.set(menu.id, menu));
      }

      // 9. 모든 메뉴의 순서를 연속적으로 재설정
      const menuArray = Array.from(menuMap.values());
      for (let i = 0; i < menuArray.length; i++) {
        await connection.execute(
          "UPDATE menus SET parent_id = ?, sort_order = ? WHERE id = ?",
          [menuArray[i].parent_id, i + 1, menuArray[i].id]
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
