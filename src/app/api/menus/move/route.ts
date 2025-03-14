import { NextResponse } from "next/server";

// 메뉴 타입 정의
interface Menu {
  id: number;
  name: string;
  type: string;
  url?: string;
  targetId?: number;
  displayPosition: string;
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  children?: Menu[];
}

// 임시 메뉴 데이터 (실제 구현에서는 데이터베이스에서 가져옵니다)
let menus: Menu[] = [
  {
    id: 1,
    name: "홈",
    type: "LINK",
    url: "/",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "소개",
    type: "FOLDER",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    children: [
      {
        id: 3,
        name: "회사 소개",
        type: "CONTENT",
        targetId: 1,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 1,
        parentId: 2,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      {
        id: 4,
        name: "연혁",
        type: "CONTENT",
        targetId: 2,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 2,
        parentId: 2,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: 5,
    name: "게시판",
    type: "FOLDER",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    children: [
      {
        id: 6,
        name: "공지사항",
        type: "BOARD",
        targetId: 1,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 1,
        parentId: 5,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      {
        id: 7,
        name: "자유게시판",
        type: "BOARD",
        targetId: 2,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 2,
        parentId: 5,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: 8,
    name: "문의하기",
    type: "LINK",
    url: "/contact",
    displayPosition: "HEADER",
    visible: true,
    sortOrder: 4,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

// 메뉴 이동 API 엔드포인트
export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { draggedId, targetId, position } = body;

    // 필수 파라미터 확인
    if (!draggedId || !targetId || !position) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 유효한 위치 값인지 확인
    if (!["inside", "before", "after"].includes(position)) {
      return NextResponse.json(
        { success: false, message: "Invalid position value" },
        { status: 400 }
      );
    }

    // 드래그된 메뉴와 대상 메뉴 찾기
    const draggedMenu = findMenuById(menus, draggedId);
    const targetMenu = findMenuById(menus, targetId);

    if (!draggedMenu || !targetMenu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }

    // 드래그된 메뉴를 현재 위치에서 제거
    removeMenuFromTree(menus, draggedId);

    // 메뉴 이동 처리
    switch (position) {
      case "inside":
        // 대상 메뉴의 하위 메뉴로 이동
        if (!targetMenu.children) {
          targetMenu.children = [];
        }
        draggedMenu.parentId = targetId;
        draggedMenu.sortOrder = getNextSortOrder(targetMenu.children);
        targetMenu.children.push(draggedMenu);
        break;
      case "before":
        // 대상 메뉴 앞으로 이동
        insertMenuAtPosition(menus, draggedMenu, targetMenu, "before");
        break;
      case "after":
        // 대상 메뉴 뒤로 이동
        insertMenuAtPosition(menus, draggedMenu, targetMenu, "after");
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving menu:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 메뉴 ID로 메뉴 찾기 (재귀 함수)
function findMenuById(menus: Menu[], id: number): Menu | null {
  for (const menu of menus) {
    if (menu.id === id) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuById(menu.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 메뉴 트리에서 메뉴 제거 (재귀 함수)
function removeMenuFromTree(menus: Menu[], id: number): boolean {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === id) {
      menus.splice(i, 1);
      return true;
    }
    const children = menus[i].children;
    if (children && children.length > 0) {
      if (removeMenuFromTree(children, id)) {
        return true;
      }
    }
  }
  return false;
}

// 특정 위치에 메뉴 삽입
function insertMenuAtPosition(
  menus: Menu[],
  draggedMenu: Menu,
  targetMenu: Menu,
  position: "before" | "after"
): void {
  // 대상 메뉴의 부모 메뉴 찾기
  const parentMenus = findParentMenus(menus, targetMenu.id);

  // 부모 메뉴가 없으면 최상위 메뉴로 간주
  const menuList: Menu[] = parentMenus !== null ? parentMenus : menus;

  // 대상 메뉴의 인덱스 찾기
  const targetIndex = menuList.findIndex((menu) => menu.id === targetMenu.id);

  if (targetIndex !== -1) {
    // 드래그된 메뉴의 부모 ID 설정
    draggedMenu.parentId = targetMenu.parentId;

    // 삽입 위치에 따라 처리
    if (position === "before") {
      menuList.splice(targetIndex, 0, draggedMenu);
    } else if (position === "after") {
      menuList.splice(targetIndex + 1, 0, draggedMenu);
    }

    // 정렬 순서 재조정
    menuList.forEach((menu, index) => {
      menu.sortOrder = index + 1;
    });
  }
}

// 메뉴의 부모 메뉴 찾기 (재귀 함수)
function findParentMenus(menus: Menu[], id: number): Menu[] | null {
  for (const menu of menus) {
    if (menu.children && menu.children.length > 0) {
      if (menu.children.some((child) => child.id === id)) {
        return menu.children;
      }
      const found = findParentMenus(menu.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 다음 정렬 순서 가져오기
function getNextSortOrder(menus: Menu[]): number {
  if (menus.length === 0) {
    return 1;
  }
  const maxSortOrder = Math.max(...menus.map((menu) => menu.sortOrder || 0));
  return maxSortOrder + 1;
}
