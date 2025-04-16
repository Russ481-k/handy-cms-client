"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { MenuList } from "./components/MenuList";
import { MenuEditor } from "./components/MenuEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";

import { useMenu } from "@/lib/hooks/useMenu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi, menuKeys, UpdateMenuOrderRequest } from "@/lib/api/menu";

export interface Menu {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url?: string;
  targetId?: number;
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  children?: Menu[] | null;
  createdAt: string;
  updatedAt: string;
}

export default function MenuManagementPage() {
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  console.log(`MenuManagementPage render count: ${renderCount.current}`);

  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [parentMenuId, setParentMenuId] = useState<number | null>(null);
  const [tempMenu, setTempMenu] = useState<Menu | null>(null);
  const [loadingMenuId, setLoadingMenuId] = useState<number | null>(null);
  const [forceExpandMenuId, setForceExpandMenuId] = useState<number | null>(
    null
  );
  const [localMenus, setLocalMenus] = useState<Menu[]>([]);
  const colors = useColors();
  const { menus = [], isLoading, refreshMenus: refreshHeaderMenus } = useMenu();
  const bg = useColorModeValue(colors.bg, colors.darkBg);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  console.log("Menus data:", menus);
  console.log("Is loading:", isLoading);

  // menus가 변경될 때 localMenus 업데이트
  useEffect(() => {
    setLocalMenus(menus);
  }, [menus]);

  // 메뉴 순서 업데이트 뮤테이션
  const updateOrderMutation = useMutation({
    mutationFn: menuApi.updateMenuOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      refreshHeaderMenus();
      toaster.create({
        title: "메뉴 순서가 변경되었습니다.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error updating menu order:", error);
      toaster.create({
        title: "메뉴 순서 변경에 실패했습니다.",
        type: "error",
      });
    },
  });

  // 메뉴 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: menuApi.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      refreshHeaderMenus();
      setSelectedMenu(null);
      toaster.create({
        title: "메뉴가 삭제되었습니다.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting menu:", error);
      toaster.create({
        title: "메뉴 삭제에 실패했습니다.",
        type: "error",
      });
    },
  });

  // 메뉴 저장/업데이트 뮤테이션
  const saveMenuMutation = useMutation({
    mutationFn: (data: {
      id?: number;
      menuData: Omit<Menu, "id" | "createdAt" | "updatedAt">;
    }) => {
      return data.id
        ? menuApi.updateMenu(data.id, data.menuData)
        : menuApi.createMenu(data.menuData);
    },
    onSuccess: (savedMenu) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      refreshHeaderMenus();

      // 임시 메뉴가 저장된 경우
      if (tempMenu) {
        // 저장된 메뉴를 선택된 메뉴로 설정
        setSelectedMenu(savedMenu);
        setParentMenuId(savedMenu.parentId || null);
        setTempMenu(null);
      } else {
        // 기존 메뉴 수정의 경우
        setSelectedMenu(savedMenu);
        setParentMenuId(savedMenu.parentId || null);
      }

      toaster.create({
        title: tempMenu ? "메뉴가 생성되었습니다." : "메뉴가 수정되었습니다.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error saving menu:", error);
      toaster.create({
        title: tempMenu
          ? "메뉴 생성에 실패했습니다."
          : "메뉴 수정에 실패했습니다.",
        type: "error",
      });
    },
  });

  const handleMoveMenu = async (
    draggedId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => {
    try {
      setLoadingMenuId(draggedId);
      const request: UpdateMenuOrderRequest = {
        id: draggedId,
        targetId: targetId === -1 ? null : targetId,
        position: targetId === -1 ? "inside" : position,
      };
      await updateOrderMutation.mutateAsync([request]);
    } finally {
      setLoadingMenuId(null);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      setIsDeleting(true);
      setLoadingMenuId(menuId);

      // 삭제할 메뉴의 부모 메뉴 찾기
      const parentMenu = findParentMenu(menus, menuId);

      // 임시 메뉴인 경우 서버 요청 없이 클라이언트에서만 처리
      if (tempMenu && tempMenu.id === menuId) {
        setTempMenu(null);
      } else {
        // 서버에서 메뉴 삭제
        await deleteMutation.mutateAsync(menuId);
      }

      // 부모 메뉴 선택
      if (parentMenu) {
        setSelectedMenu(parentMenu);
        setParentMenuId(parentMenu.parentId || null);
        // 부모 메뉴가 폴더인 경우에만 forceExpandMenuId 설정
        if (parentMenu.type === "FOLDER") {
          setForceExpandMenuId(parentMenu.id);
        }
      }
    } finally {
      setIsDeleting(false);
      setLoadingMenuId(null);
    }
  };

  const handleSubmit = async (
    menuData: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const menuId = tempMenu ? undefined : selectedMenu?.id;
      if (menuId !== undefined) {
        setLoadingMenuId(menuId);
      }
      await saveMenuMutation.mutateAsync({
        id: menuId,
        menuData,
      });
    } catch (error) {
      console.error("Error saving menu:", error);
    } finally {
      setLoadingMenuId(null);
    }
  };

  // 메뉴 목록에 새 메뉴 추가하는 함수
  const addMenuToList = (newMenu: Menu, targetMenu: Menu | null = null) => {
    if (!targetMenu) {
      return [...menus, newMenu];
    }

    const updateMenuTree = (menuList: Menu[]): Menu[] => {
      return menuList.map((menu) => {
        if (menu.id === targetMenu.id) {
          const updatedChildren = [...(menu.children || [])];
          updatedChildren.push(newMenu);
          return {
            ...menu,
            children: updatedChildren,
          };
        }
        if (menu.children && menu.children.length > 0) {
          return {
            ...menu,
            children: updateMenuTree(menu.children),
          };
        }
        return menu;
      });
    };

    return updateMenuTree(menus);
  };

  // 새 메뉴 추가 핸들러
  const handleAddMenu = (parentMenu: Menu) => {
    console.log("Creating new menu under parent:", parentMenu.name);

    const newTempMenu: Menu = {
      id: Date.now(),
      name: "새 메뉴",
      type: "LINK",
      parentId: parentMenu.id === -1 ? undefined : parentMenu.id,
      sortOrder: parentMenu.children ? parentMenu.children.length + 1 : 1,
      visible: true,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayPosition: "HEADER",
    };

    // 메뉴 트리에 임시 메뉴 추가
    const updatedMenus = addMenuToList(
      newTempMenu,
      parentMenu.id === -1 ? null : parentMenu
    );

    // 로컬 상태 업데이트
    setLocalMenus(updatedMenus);
    // React Query 캐시 업데이트
    queryClient.setQueryData(menuKeys.lists(), updatedMenus);

    setTempMenu(newTempMenu);
    setSelectedMenu(newTempMenu);
    setParentMenuId(parentMenu.id === -1 ? null : parentMenu.id);
    setForceExpandMenuId(parentMenu.id);
  };

  const updateMenuTree = (
    menus: Menu[],
    targetId: number,
    updateCallback: (menu: Menu) => Menu
  ): Menu[] => {
    return menus.map((menu) => {
      if (menu.id === targetId) {
        return updateCallback(menu);
      }
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: updateMenuTree(menu.children, targetId, updateCallback),
        };
      }
      return menu;
    });
  };

  const handleEditMenu = (menu: Menu) => {
    if (tempMenu) {
      // 임시 메뉴 수정 중인 경우 경고 모달 표시
      if (window.confirm("새 메뉴 추가가 취소됩니다. 취소하시겠습니까?")) {
        // 임시 메뉴를 메뉴 목록에서 제거
        const updatedMenus = menus.filter((m) => m.id !== tempMenu.id);
        queryClient.setQueryData(menuKeys.lists(), updatedMenus);

        setTempMenu(null);
        setSelectedMenu(menu);
        setParentMenuId(menu.parentId || null);
      }
    } else {
      setSelectedMenu(menu);
      setParentMenuId(menu.parentId || null);
    }
  };

  const handleCloseEditor = () => {
    if (tempMenu) {
      // 임시 메뉴인 경우 삭제
      const updatedMenus = menus.filter((m) => m.id !== tempMenu.id);
      queryClient.setQueryData(menuKeys.lists(), updatedMenus);

      setTempMenu(null);
      setSelectedMenu(menus[0] || null);
    } else {
      // 기존 메뉴 편집 중 취소
      setSelectedMenu(null);
    }
  };

  const handleCancelConfirm = () => {
    setTempMenu(null);
    setSelectedMenu(null);
    setParentMenuId(null);
    setIsCancelDialogOpen(false);
  };

  const handleCancelCancel = () => {
    setIsCancelDialogOpen(false);
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

  // 메뉴 관리 페이지 레이아웃 정의
  const menuLayout = [
    {
      id: "header",
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      isStatic: true,
      isHeader: true,
    },
    {
      id: "menuList",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      title: "메뉴 목록",
      subtitle: "드래그 앤 드롭으로 메뉴 순서를 변경할 수 있습니다.",
    },
    {
      id: "menuEditor",
      x: 0,
      y: 6,
      w: 3,
      h: 6,
      title: "메뉴 편집",
      subtitle: "메뉴의 상세 정보를 수정할 수 있습니다.",
    },
    {
      id: "preview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "미리보기",
      subtitle: "메뉴 구조의 실시간 미리보기입니다.",
    },
  ];

  // 메뉴 목록이 업데이트될 때 선택된 메뉴를 동기화
  useEffect(() => {
    if (menus.length > 0) {
      // 임시 메뉴가 없는 경우에만 초기 메뉴 선택
      if (!tempMenu && !selectedMenu) {
        setSelectedMenu(menus[0]);
      }
      // 임시 메뉴가 있는 경우, 해당 메뉴를 계속 선택 상태로 유지
      else if (tempMenu) {
        setSelectedMenu(tempMenu);
      }
    }
  }, [menus, tempMenu, selectedMenu]);

  return (
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={menuLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading
                size="lg"
                color={colors.text.primary}
                letterSpacing="tight"
              >
                메뉴 관리
              </Heading>
              <Badge
                bg={colors.secondary.light}
                color={colors.secondary.default}
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
              >
                관리자
              </Badge>
            </Flex>
          </Flex>

          <Box>
            <DndProvider backend={HTML5Backend}>
              <MenuList
                menus={localMenus}
                onAddMenu={handleAddMenu}
                onEditMenu={handleEditMenu}
                onDeleteMenu={handleDeleteMenu}
                onMoveMenu={handleMoveMenu}
                isLoading={isLoading}
                selectedMenuId={selectedMenu?.id}
                loadingMenuId={loadingMenuId}
                forceExpandMenuId={forceExpandMenuId}
              />
            </DndProvider>
          </Box>

          <Box>
            <MenuEditor
              menu={selectedMenu}
              onClose={handleCloseEditor}
              onDelete={handleDeleteMenu}
              onSubmit={handleSubmit}
              parentId={parentMenuId}
              onAddMenu={() => {
                if (selectedMenu?.type === "FOLDER") {
                  handleAddMenu(selectedMenu);
                } else if (selectedMenu?.parentId) {
                  // 현재 메뉴의 부모 메뉴를 찾아서 하위 메뉴로 추가
                  const parentMenu = findParentMenu(
                    menus,
                    selectedMenu.parentId
                  );
                  if (parentMenu) {
                    handleAddMenu(parentMenu);
                  }
                } else {
                  // 부모 메뉴가 없는 경우 전체 메뉴(-1)의 하위 메뉴로 추가
                  handleAddMenu({
                    id: -1,
                    name: "전체",
                    type: "FOLDER",
                    visible: true,
                    sortOrder: 0,
                    children: menus,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    displayPosition: "HEADER",
                  });
                }
              }}
              existingMenus={menus}
              isTempMenu={!!tempMenu}
              tempMenu={tempMenu}
              isDeleting={isDeleting}
            />
          </Box>

          <Box>
            <Main menus={menus} isPreview={true} />
          </Box>
        </GridSection>
      </Box>
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
        title="메뉴 추가 취소"
        description="새 메뉴 추가가 취소됩니다. 취소하시겠습니까?"
        confirmText="취소"
        cancelText="계속"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
      <Toaster />
    </Box>
  );
}
