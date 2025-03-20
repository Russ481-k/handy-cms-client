import { useState, useEffect } from "react";
import { Menu } from "@/types/menu";
import { getAuthHeader } from "@/lib/auth";

interface UseMenuOptions {
  requireAuth?: boolean;
}

export function useMenu(options: UseMenuOptions = {}) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMenus = async () => {
      try {
        const headers = options.requireAuth ? getAuthHeader() : {};
        const response = await fetch("/api/menu", { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch menus");
        }

        const data = await response.json();
        if (isMounted) {
          setMenus(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch menus")
          );
        }
      }
    };

    fetchMenus();

    return () => {
      isMounted = false;
    };
  }, [options.requireAuth]);

  return { menus, error };
}
