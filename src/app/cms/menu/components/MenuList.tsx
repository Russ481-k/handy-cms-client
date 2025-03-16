"use client";

import { useState } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { MenuItem } from "./MenuItem";
import { Menu } from "../page";

export interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: number) => void;
  onMoveMenu: (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
  selectedMenuId?: number;
  refreshMenus: () => Promise<void>;
}

export const MenuList = ({
  menus,
  onEditMenu,
  onDeleteMenu,
  onMoveMenu,
  isLoading,
  selectedMenuId,
  refreshMenus,
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

  const renderMenuItem = (menu: Menu, level: number, index: number) => {
    return (
      <MenuItem
        key={menu.id}
        menu={menu}
        level={level}
        onEditMenu={onEditMenu}
        onDeleteMenu={onDeleteMenu}
        onMoveMenu={onMoveMenu}
        index={index}
        selectedMenuId={selectedMenuId}
        expanded={expandedMenus.has(menu.id)}
        onToggle={() => toggleMenu(menu.id)}
        refreshMenus={refreshMenus}
      />
    );
  };

  const renderMenuItems = (items: Menu[], level = 0) => {
    return items.map((menu, index) => (
      <Box key={menu.id}>
        {renderMenuItem(menu, level, index)}
        {menu.children &&
          menu.children.length > 0 &&
          expandedMenus.has(menu.id) && (
            <Box ml={4}>{renderMenuItems(menu.children, level + 1)}</Box>
          )}
      </Box>
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
