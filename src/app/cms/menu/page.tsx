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
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  parentId?: number | null;
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
  const [tempMenu, setTempMenu] = useState<Menu | null>(null);
  const colors = useColors();
  const { refreshMenus: refreshHeaderMenus } = useMenu();
  const bg = useColorModeValue(colors.bg, colors.darkBg);

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

  // 메뉴 목록에 새 메뉴 추가하는 함수
  const addMenuToList = (newMenu: Menu, targetMenu: Menu | null = null) => {
    setMenus((prevMenus) => {
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
    console.log("handleAddMenu called with parentMenu:", parentMenu);

    // 고유한 ID 생성 (타임스탬프 + 랜덤 숫자)
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return parseInt(`${timestamp}${random}`);
    };

    const newTempMenu: Menu = {
      id: generateUniqueId(),
      name: "새 메뉴",
      type: "LINK", // 기본 타입을 LINK로 설정
      parentId: parentMenu.id,
      sortOrder: parentMenu.children ? parentMenu.children.length + 1 : 1,
      visible: true,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayPosition: "HEADER",
    };

    console.log("New temp menu created:", newTempMenu);

    // 선택된 메뉴 아래에 추가
    setMenus((prevMenus) => {
      const updateMenuTree = (menus: Menu[]): Menu[] => {
        return menus.map((menu) => {
          if (menu.id === parentMenu.id) {
            return {
              ...menu,
              children: [...(menu.children || []), newTempMenu],
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
      return updateMenuTree(prevMenus);
    });

    console.log("Setting temp menu and selected menu:", newTempMenu);
    // 새 메뉴를 선택하고 임시 메뉴로 설정
    setTempMenu(newTempMenu);
    setSelectedMenu(newTempMenu);
    setParentMenuId(parentMenu.id);

    // 메뉴 편집기로 포커스 이동
    setTimeout(() => {
      const nameInput = document.querySelector(
        'input[name="name"]'
      ) as HTMLInputElement;
      console.log("Looking for name input:", nameInput);
      if (nameInput) {
        nameInput.focus();
        nameInput.setSelectionRange(
          nameInput.value.length,
          nameInput.value.length
        );
        console.log("Name input focused");
      }
    }, 100);
  };

  // 최상단 메뉴 추가 핸들러
  const handleAddTopMenu = () => {
    // 고유한 ID 생성 (타임스탬프 + 랜덤 숫자)
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return parseInt(`${timestamp}${random}`);
    };

    const newTempMenu: Menu = {
      id: generateUniqueId(), // 고유한 ID 생성
      name: "새 메뉴",
      type: "LINK",
      url: "",
      displayPosition: "HEADER",
      visible: true,
      parentId: null, // 최상단 메뉴는 parentId가 null
      sortOrder: 1, // 최상단에 추가되므로 sortOrder는 1
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 기존 메뉴들의 sortOrder를 1씩 증가
    setMenus((prevMenus) => {
      const updatedMenus = prevMenus.map((menu) => ({
        ...menu,
        sortOrder: menu.sortOrder + 1,
      }));
      // 새 메뉴를 최상단에 추가
      updatedMenus.unshift(newTempMenu);
      return updatedMenus;
    });

    setTempMenu(newTempMenu);
    setSelectedMenu(newTempMenu);
  };

  const handleEditMenu = (menu: Menu) => {
    if (tempMenu) {
      // 임시 메뉴 수정 중인 경우 경고 모달 표시
      if (window.confirm("새 메뉴 추가가 취소됩니다. 계속하시겠습니까?")) {
        // 임시 메뉴를 메뉴 목록에서 제거
        setMenus((prevMenus) => prevMenus.filter((m) => m.id !== tempMenu.id));
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
      setSelectedMenu(menus[0] || null);
    } else {
      // 기존 메뉴 편집 중 취소
      setSelectedMenu(null);
    }
  };

  const handleSubmit = async (
    menuData: Omit<Menu, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch(
        tempMenu ? "/api/cms/menu" : `/api/cms/menu/${selectedMenu?.id}`,
        {
          method: tempMenu ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify(menuData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save menu");
      }

      const savedMenu = await response.json();

      // 메뉴 목록 새로고침
      await refreshMenus();

      // 임시 메뉴 초기화
      setTempMenu(null);

      // 저장된 메뉴 선택
      setSelectedMenu(savedMenu);
      setParentMenuId(savedMenu.parentId || null);

      toaster.create({
        title: "메뉴가 저장되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving menu:", error);
      toaster.create({
        title: "메뉴 저장 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    try {
      const response = await fetch(`/api/cms/menu?id=${menuId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
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

  // 초기 메뉴 선택
  useEffect(() => {
    if (menus.length > 0 && !selectedMenu && !tempMenu) {
      setSelectedMenu(menus[0]);
    }
  }, [menus, selectedMenu, tempMenu]);

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
            <Flex gap={2}>
              <Button
                onClick={handleAddTopMenu}
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
                최상단 메뉴 추가
              </Button>
              <Button
                onClick={() => handleAddMenu(menus[0])}
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
          </Flex>

          <Box>
            <DndProvider backend={HTML5Backend}>
              <MenuList
                menus={menus}
                onAddMenu={handleAddMenu}
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
              onAddMenu={() => handleAddMenu(menus[0])}
              existingMenus={menus}
              isTempMenu={!!tempMenu}
              tempMenu={tempMenu}
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
