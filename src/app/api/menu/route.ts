import { NextResponse } from "next/server";
import dbPool from "@/lib/db";
import { Menu } from "@/types/menu";
import { RowDataPacket } from "mysql2";

interface MenuRow extends RowDataPacket {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url: string | null;
  target_id: number | null;
  display_position: string;
  visible: number;
  sort_order: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await dbPool.execute<MenuRow[]>(
      "SELECT * FROM menus WHERE visible = 1 ORDER BY sort_order"
    );

    // 계층 구조로 변환
    const menuMap = new Map<number, Menu>();
    const rootMenus: Menu[] = [];

    // 모든 메뉴를 맵에 저장
    rows.forEach((menu) => {
      menuMap.set(menu.id, {
        id: menu.id,
        name: menu.name,
        type: menu.type,
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

    // 부모-자식 관계 설정
    menuMap.forEach((menu) => {
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children?.push(menu);
        }
      } else {
        rootMenus.push(menu);
      }
    });

    // 빈 children 배열 정리
    const finalizeMenus = (menus: Menu[]) => {
      menus.forEach((menu) => {
        if (menu.children?.length === 0) {
          menu.children = undefined;
        } else if (menu.children) {
          finalizeMenus(menu.children);
        }
      });
    };

    finalizeMenus(rootMenus);

    return NextResponse.json(rootMenus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}
