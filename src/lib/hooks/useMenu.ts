import { useState, useEffect } from "react";
import { Menu } from "@/app/cms/menu/page";
import { getAuthHeader } from "@/lib/auth";

export function useMenu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/cms/menu", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setError(error as Error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 메뉴 데이터 새로고침 함수
  const refreshMenus = () => {
    fetchMenus();
  };

  return { menus, error, refreshMenus };
}
