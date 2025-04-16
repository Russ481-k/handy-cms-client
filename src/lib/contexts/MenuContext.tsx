import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@/app/cms/menu/page";
import { menuApi, menuKeys } from "@/lib/api/menu";

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
  } = useQuery({
    queryKey: menuKeys.all,
    queryFn: menuApi.getMenus,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <MenuContext.Provider
      value={{ menus, isLoading, error: error as Error | null }}
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
