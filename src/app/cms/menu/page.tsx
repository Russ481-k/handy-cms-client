"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/app/cms/menu/components/MenuList";
import { MenuEditor } from "@/app/cms/menu/components/MenuEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";

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
  const colors = useColors();
  const bg = useColorModeValue(colors.bg, colors.darkBg);

  // 테마 색상 적용
  const headingColor = useColorModeValue(
    colors.text.primary,
    colors.text.primary
  );
  const buttonBg = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );
  const buttonHoverBg = useColorModeValue(
    colors.primary.hover,
    colors.primary.hover
  );

  const badgeBg = useColorModeValue(colors.primary.light, colors.primary.light);
  const badgeColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  // 메뉴 목록 새로고침 함수
  const refreshMenus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/menu", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      console.log("API Response:", data);

      // 메뉴를 sortOrder 기준으로 정렬
      const sortMenus = (menus: Menu[]): Menu[] => {
        const sorted = menus
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((menu) => ({
            ...menu,
            children: menu.children ? sortMenus(menu.children) : [],
          }));
        console.log("Sorted menus:", sorted);
        return sorted;
      };

      const sortedMenus = sortMenus(data);
      console.log("Final menus:", sortedMenus);
      setMenus(sortedMenus);
    } catch (error) {
      console.error("Error fetching menus:", error);
      alert("메뉴 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 메뉴 순서 변경 핸들러
  const handleMoveMenu = async (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => {
    try {
      const response = await fetch("/api/cms/menu/order", {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuId, targetId, position }),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu order");
      }

      await refreshMenus();
    } catch (error) {
      console.error("Error updating menu order:", error);
      alert("메뉴 순서 변경에 실패했습니다.");
    }
  };

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

  const handleSubmit = async (
    menuData: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const url = selectedMenu
        ? `/api/cms/menu/${selectedMenu.id}`
        : "/api/cms/menu";
      const method = selectedMenu ? "PUT" : "POST";

      // 새 메뉴 추가 시 부모 메뉴 ID 설정
      const menuDataWithParent = {
        ...menuData,
        parentId: selectedMenu ? menuData.parentId : parentMenuId,
      };

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuDataWithParent),
      });

      if (!response.ok) {
        throw new Error("Failed to save menu");
      }

      await refreshMenus();
      setSelectedMenu(null);
      setParentMenuId(null); // 부모 메뉴 ID 초기화
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
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={menuLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading size="lg" color={headingColor} letterSpacing="tight">
                메뉴 관리
              </Heading>
              <Badge
                bg={badgeBg}
                color={badgeColor}
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
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "translateY(-2px)" }}
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
            <Main menus={menus} />
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
