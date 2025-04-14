"use client";

import { useState, useRef, useEffect } from "react";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi, menuKeys } from "@/lib/api/menu";

interface MenuListProps {
  menus: Menu[];
  onAddMenu: (menu: Menu) => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (menuId: number) => void;
  onMoveMenu: (
    draggedId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => void;
  onSelectMenu: (menuId: number | null) => void;
  isLoading: boolean;
  selectedMenuId?: number;
  loadingMenuId?: number | null;
}

export function MenuList({
  menus,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
  onMoveMenu,
  onSelectMenu,
  isLoading,
  selectedMenuId,
  loadingMenuId,
}: MenuListProps) {
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(
    new Set([-1])
  );
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const menuListRef = useRef<HTMLDivElement>(null);
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

  const queryClient = useQueryClient();

  const { data: menuData, isLoading: queryLoading } = useQuery({
    queryKey: menuKeys.lists(),
    queryFn: menuApi.getMenus,
    initialData: menus,
  });

  const updateOrderMutation = useMutation({
    mutationFn: menuApi.updateMenuOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: menuApi.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });

  const handleDeleteMenu = async (menuId: number) => {
    try {
      await deleteMutation.mutateAsync(menuId);
      if (selectedMenuId === menuId) {
        onSelectMenu(null);
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const handleUpdateMenuOrder = async (
    orders: Array<{
      id: number;
      targetId: number | null;
      position: "before" | "after" | "inside";
    }>
  ) => {
    try {
      await updateOrderMutation.mutateAsync(orders);
    } catch (error) {
      console.error("Error updating menu order:", error);
    }
  };

  const toggleMenu = (menuId: number) => {
    if (menuId === -1) return;

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

  const findParentMenu = (menus: Menu[], targetId: number): Menu | null => {
    // 전체 메뉴인 경우
    if (targetId === -1) {
      return {
        id: -1,
        name: "전체",
        type: "FOLDER",
        visible: true,
        sortOrder: 0,
        children: menus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayPosition: "HEADER",
      };
    }

    for (const menu of menus) {
      if (menu.id === targetId) {
        return menu;
      }
      if (menu.children && menu.children.length > 0) {
        const found = findParentMenu(menu.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleAddMenu = (parentMenu: Menu) => {
    console.log("MenuList handleAddMenu called with parentMenu:", parentMenu);

    // 전체 메뉴인 경우 (id가 -1)
    if (parentMenu.id === -1) {
      // 전체 메뉴를 부모로 사용
      onAddMenu(parentMenu);
      return;
    }

    // 부모 메뉴의 전체 트리 구조를 찾기
    const fullParentMenu = findParentMenu(menus, parentMenu.id);
    console.log("Found full parent menu:", fullParentMenu);

    if (!fullParentMenu) return;

    // 부모 메뉴가 접혀있으면 펼치기
    if (!expandedMenus.has(fullParentMenu.id)) {
      console.log("Expanding parent menu:", fullParentMenu.id);
      toggleMenu(fullParentMenu.id);
    }

    // 부모 컴포넌트의 handleAddMenu 함수 호출
    onAddMenu(fullParentMenu);
  };

  const handleMoveMenu = (
    draggedId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => {
    // 전체 메뉴로의 이동은 최상위로 이동하는 것으로 처리
    if (targetId === -1) {
      onMoveMenu(draggedId, 0, position); // 0은 최상위 메뉴를 나타냄
      return;
    }
    onMoveMenu(draggedId, targetId, position);
  };

  const handleDeleteClick = (menu: Menu) => {
    setMenuToDelete(menu);
  };

  const handleDeleteConfirm = () => {
    if (menuToDelete) {
      onDeleteMenu(menuToDelete.id);
      setMenuToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setMenuToDelete(null);
  };

  // 선택된 메뉴로 스크롤 이동
  useEffect(() => {
    if (selectedMenuId && menuListRef.current) {
      const selectedElement = menuListRef.current.querySelector(
        `[data-menu-id="${selectedMenuId}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedMenuId]);

  const renderMenuItem = (menu: Menu, level: number, index: number) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isFolder = menu.type === "FOLDER";
    const isExpanded = expandedMenus.has(menu.id);
    const isLoading = loadingMenuId === menu.id;

    return (
      <div key={menu.id} data-menu-id={menu.id}>
        <DropZone
          onDrop={handleMoveMenu}
          targetId={menu.id}
          level={level}
          isFolder={isFolder}
        />
        <Box cursor={menu.id === -1 ? "not-allowed" : "pointer"}>
          <ListItem
            id={menu.id}
            name={menu.name}
            icon={isLoading ? <Spinner size="sm" /> : getMenuIcon(menu)}
            isSelected={menu.id === selectedMenuId}
            onAddMenu={() => handleAddMenu(menu)}
            onDelete={
              menu.id === -1 ? undefined : () => handleDeleteClick(menu)
            }
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
            type={menu.type}
          />
        </Box>
        {hasChildren && (
          <Box
            pl={6}
            style={{
              maxHeight: isExpanded ? "1000px" : "0",
              overflow: "hidden",
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? "translateY(0)" : "translateY(-10px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {menu.children?.map((child, childIndex) =>
              renderMenuItem(child, level + 1, childIndex)
            )}
          </Box>
        )}
      </div>
    );
  };

  if (queryLoading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner />
      </Flex>
    );
  }

  // 전체 메뉴를 최상위 루트로 추가
  const rootMenu: Menu = {
    id: -1,
    name: "전체",
    type: "FOLDER",
    visible: true,
    sortOrder: 0,
    children: menus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    displayPosition: "HEADER",
  };

  if (menus.length === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text color="gray.500">메뉴가 없습니다.</Text>
      </Flex>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        ref={(node: HTMLDivElement | null) => {
          if (node) {
            drag(node);
            menuListRef.current = node;
          }
        }}
      >
        <VStack gap={0} align="stretch">
          <DropZone
            targetId={rootMenu.id}
            level={0}
            onDrop={(draggedId, targetId, position) => {
              onMoveMenu(draggedId, targetId, "before");
            }}
          />
          {renderMenuItem(rootMenu, 0, 0)}
          <DropZone
            targetId={rootMenu.id}
            level={0}
            onDrop={(draggedId, targetId, position) => {
              onMoveMenu(draggedId, targetId, "after");
            }}
          />
        </VStack>
      </Box>
      <ConfirmDialog
        isOpen={!!menuToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="메뉴 삭제"
        description={`"${menuToDelete?.name}" 메뉴를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
    </DndProvider>
  );
}
