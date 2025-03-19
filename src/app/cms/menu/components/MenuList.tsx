"use client";

import { useState } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { Menu } from "../page";
import { ListItem } from "@/components/ui/list-item";
import {
  LuFolder,
  LuFolderOpen,
  LuLink,
  LuLayoutList,
  LuFileText,
} from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";

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
  isLoading,
  selectedMenuId,
}: MenuListProps) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const colors = useColors();
  const iconColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );
  const folderColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

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

  const getMenuIcon = (menu: Menu) => {
    const isExpanded = expandedMenus.has(menu.id);
    const hasChildren = menu.children && menu.children.length > 0;
    const color = menu.type === "FOLDER" ? folderColor : iconColor;

    switch (menu.type) {
      case "FOLDER":
        return hasChildren && isExpanded ? (
          <Box color={color}>
            <LuFolderOpen />
          </Box>
        ) : (
          <Box color={color}>
            <LuFolder />
          </Box>
        );
      case "LINK":
        return (
          <Box color={color}>
            <LuLink />
          </Box>
        );
      case "BOARD":
        return (
          <Box color={color}>
            <LuLayoutList />
          </Box>
        );
      case "CONTENT":
        return (
          <Box color={color}>
            <LuFileText />
          </Box>
        );
      default:
        return (
          <Box color={color}>
            <LuLink />
          </Box>
        );
    }
  };

  const renderMenuItem = (menu: Menu, level: number) => {
    const hasChildren = menu.children && menu.children.length > 0;

    return (
      <Box key={menu.id} pl={`${level * 24}px`}>
        <ListItem
          name={menu.name}
          icon={getMenuIcon(menu)}
          isSelected={menu.id === selectedMenuId}
          onEdit={() => onEditMenu(menu)}
          onDelete={() => onDeleteMenu(menu.id)}
          renderBadges={() => !menu.visible && "비활성"}
          onClick={() => {
            onEditMenu(menu);
            if (hasChildren) {
              toggleMenu(menu.id);
            }
          }}
        />
        {hasChildren && expandedMenus.has(menu.id) && menu.children && (
          <Box>{renderMenuItems(menu.children, level + 1)}</Box>
        )}
      </Box>
    );
  };

  const renderMenuItems = (items: Menu[], level = 0) => {
    return items.map((menu) => renderMenuItem(menu, level));
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
