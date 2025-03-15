import { Menu } from "./types";

const API_BASE_URL = "/api/cms/menu";

export const menuApi = {
  // 메뉴 목록 조회
  getMenus: async (): Promise<Menu[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch menus");
    }
    return response.json();
  },

  // 메뉴 생성
  createMenu: async (
    menu: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ): Promise<Menu> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menu),
    });
    if (!response.ok) {
      throw new Error("Failed to create menu");
    }
    return response.json();
  },

  // 메뉴 수정
  updateMenu: async (
    id: number,
    menu: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ): Promise<Menu> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menu),
    });
    if (!response.ok) {
      throw new Error("Failed to update menu");
    }
    return response.json();
  },

  // 메뉴 삭제
  deleteMenu: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete menu");
    }
  },

  // 메뉴 순서 변경
  updateMenuOrder: async (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${menuId}/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetId, position }),
    });
    if (!response.ok) {
      throw new Error("Failed to update menu order");
    }
  },
};
