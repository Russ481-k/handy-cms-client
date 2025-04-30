import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/types/api";
import { menuApi, menuKeys } from "@/lib/api/menu";
import { api, ApiResponse } from "@/lib/api-client";
import { useAuth } from "@/lib/AuthContext";
import { MenuSquare } from "lucide-react";

interface MenuContextType {
  menus: Menu[];
  isLoading: boolean;
  error: Error | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const {
    data: menus = [],
    isLoading,
    error,
  } = useQuery<Menu[]>({
    queryKey: menuKeys.all,
    queryFn: async () => {
      const response = isAuthenticated
        ? await api.private.menu.getMenus()
        : await api.public.menu.getMenus();
      return (response as ApiResponse<Menu[]>).data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <MenuContext.Provider
      value={{
        // @ts-ignore
        menus: menus.data,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
}
