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

// 메뉴 관련 API 타입 정의
export interface MenuApi {
  getMenus: () => Promise<Menu[]>;
  getMenu: (id: number) => Promise<Menu>;
  createMenu: (
    data: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => Promise<Menu>;
  updateMenu: (
    id: number,
    data: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => Promise<Menu>;
  deleteMenu: (id: number) => Promise<void>;
  updateMenuOrder: (
    orders: Array<{
      id: number;
      targetId: number | null;
      position: "before" | "after" | "inside";
    }>
  ) => Promise<void>;
}

export interface UpdateMenuOrderRequest {
  id: number;
  targetId: number | null;
  position: "before" | "after" | "inside";
}

// 메뉴 API 구현
export const menuApi: MenuApi = {
  getMenus: async () => {
    const response = await api.private.get<Menu[]>("/cms/menu");
    return response.data;
  },

  getMenu: async (id: number) => {
    const response = await api.private.get<Menu>(`/cms/menu/${id}`);
    return response.data;
  },

  createMenu: async (data) => {
    const response = await api.private.post<Menu>("/cms/menu", data);
    return response.data;
  },

  updateMenu: async (id, data) => {
    const response = await api.private.put<Menu>(`/cms/menu/${id}`, data);
    return response.data;
  },

  deleteMenu: async (id) => {
    await api.private.delete(`/cms/menu?id=${id}`);
  },

  updateMenuOrder: async (orders) => {
    await api.private.put("/cms/menu/order", { menuOrders: orders });
  },
};

// React Query 키 정의
export const menuKeys = {
  all: ["menus"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (filters: string) => [...menuKeys.lists(), { filters }] as const,
  details: () => [...menuKeys.all, "detail"] as const,
  detail: (id: number) => [...menuKeys.details(), id] as const,
};
