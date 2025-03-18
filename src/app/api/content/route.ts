import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth-utils";

interface MenuRow {
  id: number;
  name: string;
  type: string;
  url: string;
  parent_id: number | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: number;
  name: string;
  url: string;
  parentId: number | null;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  children?: MenuItem[];
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
      // 컨텐츠 타입의 메뉴 목록 조회
      const [menus] = await connection.execute(
        "SELECT * FROM menus WHERE type = 'CONTENT' ORDER BY created_at DESC"
      );

      // 트리 구조로 변환
      const menuMap = new Map<number, MenuItem>();
      const rootMenus: MenuItem[] = [];

      // 먼저 모든 메뉴를 맵에 저장
      (menus as MenuRow[]).forEach((menu) => {
        menuMap.set(menu.id, {
          id: menu.id,
          name: menu.name,
          url: menu.url,
          parentId: menu.parent_id,
          visible: menu.is_visible,
          createdAt: menu.created_at,
          updatedAt: menu.updated_at,
          children: [],
        });
      });

      // 부모-자식 관계 설정
      menuMap.forEach((menu) => {
        if (menu.parentId === null) {
          rootMenus.push(menu);
        } else {
          const parent = menuMap.get(menu.parentId);
          if (parent) {
            parent.children?.push(menu);
          }
        }
      });

      // 빈 children 배열 정리
      const finalizeMenus = (menus: MenuItem[]) => {
        menus.forEach((menu) => {
          if (menu.children?.length === 0) {
            menu.children = undefined;
          } else if (menu.children) {
            finalizeMenus(menu.children);
          }
        });
      };

      finalizeMenus(rootMenus);

      // 정렬된 메뉴 목록 반환
      return NextResponse.json(rootMenus);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching contents:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
