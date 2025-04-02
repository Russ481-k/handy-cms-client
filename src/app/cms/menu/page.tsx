"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Badge, Button } from "@chakra-ui/react";
import { MenuList } from "./components/MenuList";
import { MenuEditor } from "./components/MenuEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";
import { api } from "@/lib/api-client";
import { MenuData } from "@/types/api";
import { useMenu } from "@/lib/hooks/useMenu";

export interface Menu {
  id: number;
  name: string;
  type: "LINK" | "FOLDER" | "BOARD" | "CONTENT";
  url?: string;
  targetId?: number;
  displayPosition: string;
  visible: boolean;
  sortOrder: number;
  parentId?: number;
  children?: Menu[] | null;
  createdAt: string;
  updatedAt: string;
}

export default function MenuManagementPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [parentMenuId, setParentMenuId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const colors = useColors();
  const { refreshMenus: refreshHeaderMenus } = useMenu();

  // 메뉴 목록 새로고침 함수
  const refreshMenus = async () => {
    try {
      setIsLoading(true);
      const response = await api.private.getCmsMenus();
      if (!response.data) {
        throw new Error("Failed to fetch menus");
      }
      console.log("API Response:", response.data);
      setMenus(response.data);
      // 미리보기 헤더도 함께 업데이트
      refreshHeaderMenus();
    } catch (error) {
      console.error("Error fetching menus:", error);
      toaster.error({
        title: "메뉴 목록을 불러오는데 실패했습니다.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 메뉴 순서 변경 핸들러
  const handleMoveMenu = useCallback(
    async (
      draggedId: number,
      targetId: number,
      position: "before" | "after" | "inside"
    ) => {
      if (isMoving) return; // 이미 이동 중이면 무시

      try {
        setIsMoving(true);
        const requestBody = {
          menuOrders: [
            {
              id: draggedId,
              targetId: targetId,
              position: position,
            },
          ],
        };
        console.log("Move Menu Request:", JSON.stringify(requestBody, null, 2));

        const response = await fetch("/api/cms/menu/order", {
          method: "PUT",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Move Menu Error Response:", errorData);
          console.error("Request URL:", response.url);
          console.error("Request Headers:", getAuthHeader());
          throw new Error("Failed to update menu order");
        }

        await refreshMenus();
      } catch (error) {
        console.error("Error updating menu order:", error);
        toaster.create({
          title: "메뉴 순서 변경에 실패했습니다.",
          type: "error",
        });
      } finally {
        setIsMoving(false);
      }
    },
    [isMoving, refreshMenus]
  );

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setParentMenuId(null);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setParentMenuId(menu.parentId || null);
  };

  const handleCloseEditor = () => {
    setSelectedMenu(null);
    setParentMenuId(null);
  };

  const handleSubmit = async (menuData: MenuData) => {
    try {
      if (selectedMenu) {
        const response = await api.private.updateCmsMenu(
          selectedMenu.id.toString(),
          menuData
        );
        if (!response.data) {
          throw new Error("Failed to update menu");
        }
      } else {
        const response = await api.private.createCmsMenu(menuData);
        if (!response.data) {
          throw new Error("Failed to create menu");
        }
      }

      await refreshMenus();
      setSelectedMenu(null);
      toaster.create({
        title: selectedMenu
          ? "메뉴가 수정되었습니다."
          : "메뉴가 생성되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving menu:", error);
      toaster.create({
        title: "메뉴 저장에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      const response = await fetch(`/api/cms/menu/${menuId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu");
      }

      await refreshMenus();
      setSelectedMenu(null);
      toaster.create({
        title: "메뉴가 삭제되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting menu:", error);
      toaster.create({
        title: "메뉴 삭제에 실패했습니다.",
        type: "error",
      });
    }
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

  // 메뉴 목록 불러오기
  useEffect(() => {
    refreshMenus();
  }, []);

  return (
    <Box bg={colors.bg} minH="100vh" w="full" position="relative">
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
            <Button
              onClick={handleAddMenu}
              bg={colors.primary.default}
              color={colors.text.primary}
              _hover={{
                bg: colors.primary.hover,
                transform: "translateY(-2px)",
              }}
              _active={{ transform: "translateY(0)" }}
              shadow={colors.shadow.sm}
              transition="all 0.3s ease"
              size="sm"
            >
              새 메뉴 추가
            </Button>
          </Flex>

          <Box>
            <DndProvider backend={HTML5Backend}>
              <MenuList
                menus={menus}
                onEditMenu={handleEditMenu}
                onDeleteMenu={handleDeleteMenu}
                onMoveMenu={handleMoveMenu}
                isLoading={isLoading}
                selectedMenuId={selectedMenu?.id}
                refreshMenus={refreshMenus}
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
            />
          </Box>

          <Box>
            <Main menus={menus} isPreview={true} />
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
