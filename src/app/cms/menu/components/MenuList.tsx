"use client";

import { useState } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { MenuItem } from "./MenuItem";
import { MenuListProps } from "../types";

export const MenuList = ({
  menus,
  onEditMenu,
  onDeleteMenu,
  onMoveMenu,
  isLoading,
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

  const renderMenuItems = (items: typeof menus, level = 0) => {
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
