import { useState, useEffect, useCallback } from "react";
import { Menu } from "@/types/menu";
import { fetchMenus } from "@/lib/api/menu";
import { usePathname } from "next/navigation";

interface UseMenuOptions {
  autoFetch?: boolean; // 자동으로 메뉴를 가져올지 여부
  initialData?: Menu[]; // 초기 메뉴 데이터
}

interface UseMenuReturn {
  menus: Menu[];
  isLoading: boolean;
  error: Error | null;
  getMenus: () => Promise<void>; // 메뉴를 수동으로 다시 가져오는 함수
}

export function useMenu({
  autoFetch = true,
}: UseMenuOptions = {}): UseMenuReturn {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();

  const getMenus = useCallback(async () => {
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
  }, []);

  // 컴포넌트가 마운트되거나 경로가 변경될 때 자동으로 메뉴를 가져옴
  useEffect(() => {
    if (autoFetch) {
      getMenus();
    }
  }, [autoFetch, getMenus, pathname]);

  return {
    menus,
    isLoading,
    error,
    getMenus,
  };
}
