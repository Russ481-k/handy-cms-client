import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-client";
import { Menu } from "@/types/api";

interface MenuContextType {
  menus: Menu[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: () => api.public.menu.getMenus().then((response) => response.data),
  });

  const value = {
    menus,
    isLoading,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
