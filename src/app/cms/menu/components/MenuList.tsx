"use client";

import { useState } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { MenuItem } from "./MenuItem";
import { MenuListProps } from "../types";
import { Menu } from "../page";

interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: number) => void;
  onMoveMenu: (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  onAddMenu: (
    parentId?: number,
    position?: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
  selectedMenuId?: number;
}

export const MenuList = ({
  menus,
  onEditMenu,
  onDeleteMenu,
  onMoveMenu,
  onAddMenu,
  isLoading,
  selectedMenuId,
}: MenuListProps) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

  const toggleMenu = (menuId: number) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const handleAddMenu = (
    parentId?: number,
    position?: "before" | "after" | "inside"
  ) => {
    onAddMenu(parentId, position);
  };

  const renderMenuItem = (menu: Menu, level: number = 0) => {
    return (
      <MenuItem
        key={menu.id}
        menu={menu}
        level={level}
        onEditMenu={onEditMenu}
        onDeleteMenu={onDeleteMenu}
        onMoveMenu={onMoveMenu}
        onAddMenu={handleAddMenu}
        index={menu.id}
        selectedMenuId={selectedMenuId}
        expanded={expandedMenus.has(menu.id)}
        onToggle={() => toggleMenu(menu.id)}
      />
    );
  };

  const renderMenuItems = (items: Menu[], level = 0) => {
    return items.map((menu, index) => (
      <MenuItem
        key={menu.id}
        menu={menu}
        level={level}
        onEditMenu={onEditMenu}
        expanded={expandedMenus.has(menu.id)}
        onToggle={() => toggleMenu(menu.id)}
        onMoveMenu={onMoveMenu}
        onDeleteMenu={onDeleteMenu}
        onAddMenu={() => {}}
        index={index}
        selectedMenuId={selectedMenuId}
      />
    ));
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner />
      </Flex>
    );
  }

  if (menus.length === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text color="gray.500">메뉴가 없습니다.</Text>
      </Flex>
    );
  }

  return <Box data-testid="menu-list">{renderMenuItems(menus)}</Box>;
};
