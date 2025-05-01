import { Menu } from "@/types/api";
import { ApiResponse, api } from "@/lib/api-client";

// 메뉴를 sortOrder 기준으로 정렬하는 헬퍼 함수
export function sortMenus(menus: Menu[]): Menu[] {
  // Create a map of menus by ID for quick lookup
  const menuMap = new Map<number, Menu>();

  // First pass: create deep copies of menu objects
  menus?.forEach((menu) => {
    const menuCopy = {
      ...menu,
      children: [], // Initialize empty children array
    };
    menuMap.set(menu.id, menuCopy);
  });

  // Build the tree structure
  const rootMenus: Menu[] = [];

  // Second pass: build the tree structure
  menus?.forEach((menu) => {
    const menuCopy = menuMap.get(menu.id);
    if (!menuCopy) return;

    if (menu.parentId === null || menu.parentId === undefined) {
      rootMenus.push(menuCopy);
    } else {
      const parent = menuMap.get(menu.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuCopy);
      }
    }
  });

  // Third pass: sort each level
  const sortChildren = (menu: Menu) => {
    if (menu.children && menu.children.length > 0) {
      menu.children.sort((a, b) => a.sortOrder - b.sortOrder);
      menu.children.forEach(sortChildren);
    }
  };

  rootMenus.sort((a, b) => a.sortOrder - b.sortOrder);
  rootMenus?.forEach(sortChildren);

  return rootMenus;
}

// 메뉴 목록을 가져오는 API 함수
export async function fetchMenus(): Promise<Menu[]> {
  try {
    const response = await api.private.get<ApiResponse<Menu[]>>("/cms/menu");
    if (!response.data.data) {
      throw new Error("Failed to fetch menus");
    }
    const sortedMenus = sortMenus(response.data.data);
    return sortedMenus;
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
export const menuApi = {
  getMenus: async () => {
    const response = await api.private.get<ApiResponse<Menu[]>>("/cms/menu");
    const sortedMenus = sortMenus(response.data.data);
    return sortedMenus;
  },
  getMenusByType: async (type: string) => {
    const response = await api.private.get<ApiResponse<Menu[]>>(
      `/cms/menu/type/${type}`
    );
    const sortedMenus = sortMenus(response.data.data);
    return sortedMenus;
  },
  getMenu: async (id: number) => {
    const response = await api.private.get<ApiResponse<Menu>>(
      `/cms/menu/${id}`
    );
    return response.data.data;
  },
  createMenu: async (data: Omit<Menu, "id" | "createdAt" | "updatedAt">) => {
    const response = await api.private.post<ApiResponse<Menu>>(
      "/cms/menu",
      data
    );
    return response.data.data;
  },
  updateMenu: async (
    id: number,
    data: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => {
    const response = await api.private.put<ApiResponse<Menu>>(
      `/cms/menu/${id}`,
      data
    );
    return response.data.data;
  },
  deleteMenu: async (id: number) => {
    await api.private.delete(`/cms/menu/${id}`);
  },
  updateMenuOrder: async (
    orders: Array<{
      id: number;
      targetId: number | null;
      position: "before" | "after" | "inside";
    }>
  ) => {
    const response = await api.private.put<ApiResponse<Menu[]>>(
      "/cms/menu/order",
      orders.map((order) => ({
        id: order.id,
        targetId: order.targetId,
        position: order.position,
      }))
    );
    return response.data.data;
  },
};

// React Query 키 정의
export const menuKeys = {
  all: ["menus"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (filters: string) => [...menuKeys.lists(), { filters }] as const,
  byType: (type: string) => [...menuKeys.all, "type", type] as const,
  details: () => [...menuKeys.all, "detail"] as const,
  detail: (id: number) => [...menuKeys.details(), id] as const,
};
