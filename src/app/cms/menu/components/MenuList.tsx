"use client";

import { useState, useRef } from "react";
import { Box, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
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
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DropZone } from "@/components/ui/drop-zone";
import { MenuItem } from "../types";

interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: number) => void;
  onMoveMenu: (
    draggedId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  isLoading: boolean;
  selectedMenuId?: number;
  refreshMenus: () => Promise<void>;
}

export function MenuList({
  menus,
  onEditMenu,
  onDeleteMenu,
  onMoveMenu,
  isLoading,
  selectedMenuId,
}: MenuListProps) {
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

  const [{ isDragging }, drag] = useDrag({
    type: "LIST_ITEM",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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

  const renderMenuItem = (menu: Menu, level: number, index: number) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isFolder = menu.type === "FOLDER";

    return (
      <div key={menu.id}>
        <DropZone
          onDrop={onMoveMenu}
          targetId={menu.id}
          level={level}
          isFolder={isFolder}
        />
        <ListItem
          id={menu.id}
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
          index={index}
          level={level}
          isDragging={isDragging}
        />
        {hasChildren && expandedMenus.has(menu.id) && menu.children && (
          <Box pl={6}>
            {menu.children.map((child, childIndex) =>
              renderMenuItem(child, level + 1, childIndex)
            )}
          </Box>
        )}
      </div>
    );
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

  return (
    <DndProvider backend={HTML5Backend}>
      <Box ref={drag}>
        <VStack gap={0} align="stretch">
          <DropZone
            targetId={menus[0]?.id || 0}
            level={0}
            onDrop={(draggedId, targetId, position) => {
              onMoveMenu(draggedId, targetId, "before");
            }}
          />
          {menus.map((menu, index) => renderMenuItem(menu, 0, index))}
          <DropZone
            targetId={menus[menus.length - 1]?.id || 0}
            level={0}
            onDrop={(draggedId, targetId, position) => {
              onMoveMenu(draggedId, targetId, "after");
            }}
          />
        </VStack>
      </Box>
    </DndProvider>
  );
}
