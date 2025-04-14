"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [parentMenuId, setParentMenuId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [tempMenu, setTempMenu] = useState<Menu | null>(null);
  const [localMenus, setLocalMenus] = useState<Menu[]>([]);
  const [loadingMenuId, setLoadingMenuId] = useState<number | null>(null);
  const colors = useColors();
  const { refreshMenus: refreshHeaderMenus } = useMenu();
  const bg = useColorModeValue(colors.bg, colors.darkBg);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(
    undefined
  );
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 메뉴 목록을 가져오는 쿼리
  const { data: menus = [], isLoading } = useQuery({
    queryKey: menuKeys.lists(),
    queryFn: menuApi.getMenus,
  });

  // 서버 데이터가 변경되면 로컬 상태도 업데이트
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
      setTempMenu(null);
      setSelectedMenu(savedMenu);
      setParentMenuId(savedMenu.parentId || null);
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
      setIsMoving(true);
      setLoadingMenuId(draggedId);
      const request: UpdateMenuOrderRequest = {
        id: draggedId,
        targetId: targetId === -1 ? null : targetId,
        position: targetId === -1 ? "inside" : position,
      };
      await updateOrderMutation.mutateAsync([request]);
    } finally {
      setIsMoving(false);
      setLoadingMenuId(null);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      setIsDeleting(true);
      setLoadingMenuId(menuId);
      await deleteMutation.mutateAsync(menuId);
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
        id: tempMenu ? undefined : selectedMenu?.id,
        menuData,
      });
      // 메뉴 생성/수정 후 선택된 메뉴 ID 업데이트
      if (tempMenu) {
        setSelectedMenuId(undefined);
      } else {
        setSelectedMenuId(selectedMenu?.id);
      }
    } catch (error) {
      console.error("Error saving menu:", error);
    } finally {
      setLoadingMenuId(null);
    }
  };

  // 메뉴 목록에 새 메뉴 추가하는 함수
  const addMenuToList = (newMenu: Menu, targetMenu: Menu | null = null) => {
    setLocalMenus((prevMenus) => {
      if (!targetMenu) {
        // 최상위 레벨에 추가
        return [...prevMenus, newMenu];
      }

      // 메뉴 트리를 업데이트하는 재귀 함수
      const updateMenuTree = (menuList: Menu[]): Menu[] => {
        return menuList.map((menu) => {
          if (menu.id === targetMenu.id) {
            // 대상 메뉴를 찾았을 때
            const updatedChildren = [...(menu.children || [])];
            updatedChildren.push(newMenu);
            return {
              ...menu,
              children: updatedChildren,
            };
          }
          if (menu.children && menu.children.length > 0) {
            // 자식 메뉴가 있으면 재귀적으로 탐색
            return {
              ...menu,
              children: updateMenuTree(menu.children),
            };
          }
          return menu;
        });
      };

      return updateMenuTree(prevMenus);
    });
  };

  // 새 메뉴 추가 핸들러
  const handleAddMenu = (parentMenu: Menu) => {
    const newTempMenu: Menu = {
      id: Date.now(), // 임시 ID
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

    setLocalMenus((prevMenus) => {
      if (parentMenu.id === -1) {
        return [...prevMenus, newTempMenu];
      }
      return updateMenuTree(prevMenus, parentMenu.id, newTempMenu);
    });

    setTempMenu(newTempMenu);
    setSelectedMenu(newTempMenu);
    setParentMenuId(parentMenu.id === -1 ? null : parentMenu.id);
    setSelectedMenuId(newTempMenu.id);
  };

  const updateMenuTree = (
    menus: Menu[],
    targetId: number,
    newMenu: Menu
  ): Menu[] => {
    return menus.map((menu) => {
      if (menu.id === targetId) {
        return {
          ...menu,
          children: [...(menu.children || []), newMenu],
        };
      }
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: updateMenuTree(menu.children, targetId, newMenu),
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
        setLocalMenus((prevMenus) => {
          const updateMenuTree = (menus: Menu[]): Menu[] => {
            return menus
              .filter((m) => m.id !== tempMenu.id)
              .map((menu) => {
                if (menu.children && menu.children.length > 0) {
                  return {
                    ...menu,
                    children: updateMenuTree(menu.children),
                  };
                }
                return menu;
              });
          };
          return updateMenuTree(prevMenus);
        });
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
      setTempMenu(null);
      setSelectedMenu(localMenus[0] || null);
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

  // 초기 메뉴 선택
  useEffect(() => {
    if (localMenus.length > 0 && !selectedMenu && !tempMenu) {
      setSelectedMenu(localMenus[0]);
    }
  }, [localMenus, selectedMenu, tempMenu]);

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
                onSelectMenu={(id) => setSelectedMenuId(id ?? undefined)}
                isLoading={isLoading}
                selectedMenuId={selectedMenu?.id}
                loadingMenuId={loadingMenuId}
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
                if (selectedMenu?.id === -1) {
                  handleAddMenu(selectedMenu);
                } else {
                  handleAddMenu(localMenus[0]);
                }
              }}
              existingMenus={localMenus}
              isTempMenu={!!tempMenu}
              tempMenu={tempMenu}
            />
          </Box>

          <Box>
            <Main menus={localMenus} isPreview={true} />
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
