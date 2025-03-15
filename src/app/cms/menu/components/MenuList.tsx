"use client";

import { useState, useEffect } from "react";
import { Box, Center } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { Menu } from "@/app/cms/menu/page";
import { MenuItem } from "./MenuItem";
import { MenuListProps } from "../types";

export function MenuList({ onEditMenu }: MenuListProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const bgColor = useColorModeValue("transparent", "transparent");

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menus");
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      toaster.error({
        title: "메뉴 목록 로드 실패",
        description: "메뉴 목록을 불러오는 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const toggleExpanded = (menuId: number) => {
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

  const handleMoveMenu = async (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => {
    try {
      const response = await fetch(`/api/menus/${draggedId}/move`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
          position,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to move menu");
      }

      fetchMenus();
      toaster.success({
        title: "메뉴 이동 완료",
        description: "메뉴가 성공적으로 이동되었습니다.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to move menu:", error);
      toaster.error({
        title: "메뉴 이동 실패",
        description: "메뉴 이동 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu");
      }

      fetchMenus();
      toaster.success({
        title: "메뉴 삭제 완료",
        description: "메뉴가 성공적으로 삭제되었습니다.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to delete menu:", error);
      toaster.error({
        title: "메뉴 삭제 실패",
        description: "메뉴 삭제 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  const handleAddMenu = (parentId?: number, position?: "before" | "after") => {
    // 여기에 새 메뉴 추가 로직 구현
    console.log("Add menu", { parentId, position });
  };

  const renderMenuItems = (
    items: Menu[],
    level: number = 0,
    parentIndex: number = 0
  ) => {
    return items.map((menu, index) => (
      <Box key={menu.id} mb={level === 0 ? 2 : 0}>
        <MenuItem
          menu={menu}
          level={level}
          onEditMenu={onEditMenu}
          expanded={expandedMenus.has(menu.id)}
          onToggle={() => toggleExpanded(menu.id)}
          onMoveMenu={handleMoveMenu}
          onDeleteMenu={handleDeleteMenu}
          onAddMenu={handleAddMenu}
          index={parentIndex * 100 + index}
        />
        {expandedMenus.has(menu.id) &&
          menu.children &&
          menu.children.length > 0 && (
            <Box pl={level === 0 ? 3 : 2}>
              {renderMenuItems(
                menu.children,
                level + 1,
                parentIndex * 100 + index
              )}
            </Box>
          )}
      </Box>
    ));
  };

  return (
    <Box
      data-testid="menu-list"
      borderRadius="md"
      overflow="hidden"
      bg={bgColor}
      boxShadow="none"
      position="relative"
      py={2}
    >
      {menus.length > 0 ? (
        <Box>{renderMenuItems(menus)}</Box>
      ) : (
        <Center p={4} color="gray.500">
          메뉴가 없습니다.
        </Center>
      )}
    </Box>
  );
}
