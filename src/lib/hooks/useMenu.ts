import { useState, useEffect } from "react";
import { Menu } from "@/types/menu";
import { fetchMenus } from "@/lib/api/menu";

interface UseMenuOptions {
  autoFetch?: boolean; // 자동으로 메뉴를 가져올지 여부
  initialData?: Menu[]; // 초기 메뉴 데이터
}

interface UseMenuReturn {
  menus: Menu[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>; // 메뉴를 수동으로 다시 가져오는 함수
}

export function useMenu(options: UseMenuOptions = {}): UseMenuReturn {
  const { autoFetch = true, initialData = [] } = options;
  const [menus, setMenus] = useState<Menu[]>(initialData);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  // 메뉴를 가져오는 함수
  const fetchMenuData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMenus();
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch menus"));
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 자동으로 메뉴를 가져옴
  useEffect(() => {
    if (autoFetch) {
      fetchMenuData();
    }
  }, [autoFetch]);

  return {
    menus,
    isLoading,
    error,
    refetch: fetchMenuData,
  };
}
