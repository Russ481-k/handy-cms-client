import { Menu } from "@/types/menu";
import { getAuthHeader } from "@/lib/auth";

// 메뉴를 sortOrder 기준으로 정렬하는 헬퍼 함수
function sortMenus(menus: Menu[]): Menu[] {
  return menus
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((menu) => ({
      ...menu,
      children: menu.children ? sortMenus(menu.children) : [],
    }));
}

// 메뉴 목록을 가져오는 API 함수
export async function fetchMenus(): Promise<Menu[]> {
  try {
    const response = await fetch("/api/cms/menu", {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch menus");
    }

    const data = await response.json();
    return sortMenus(data);
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
}
