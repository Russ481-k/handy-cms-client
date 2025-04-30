import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/types/api";
import { menuApi } from "@/lib/api/menu";
import { api } from "@/lib/api-client";
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
    queryKey: ["menus"],
    queryFn: async () => {
      // 비공개 API 응답
      const privateResponse = await api.private.menu.getMenus();
      console.log("MenuContext - Private API Response:", privateResponse);

      // 공개 API 응답
      const publicResponse = await api.public.menu.getMenus();
      console.log("MenuContext - Public API Response:", publicResponse);

      // menuApi 응답
      const menuApiResponse = await menuApi.getMenus();
      console.log("MenuContext - MenuApi Response:", menuApiResponse);

      return menuApiResponse;
    },
  });

  console.log("MenuContext - Processed Menus:", menus);
  console.log("MenuContext - Is Authenticated:", isAuthenticated);

  return (
    <MenuContext.Provider
      value={{
        menus,
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
