import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/types/api";
import { menuApi, sortMenus } from "@/lib/api/menu";
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
  const {
    data: menus = [],
    isLoading,
    error,
  } = useQuery<Menu[]>({
    queryKey: ["menus"],
    queryFn: async () => {
      const publicResponse = await api.public.menu.getMenus();
      return (publicResponse as any).data;
    },
  });

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
