import { Menu } from "@/types/menu";
import { api } from "@/lib/api-client";

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
    const response = await api.public.getMenus();
    if (!response.data) {
      throw new Error("Failed to fetch menus");
    }
    return sortMenus(response.data);
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
}

// CMS 메뉴 목록을 가져오는 API 함수
export async function fetchCmsMenus(): Promise<Menu[]> {
  try {
    const response = await api.private.getCmsMenus();
    if (!response.data) {
      throw new Error("Failed to fetch CMS menus");
    }
    return sortMenus(response.data);
  } catch (error) {
    console.error("Error fetching CMS menus:", error);
    throw error;
  }
}
