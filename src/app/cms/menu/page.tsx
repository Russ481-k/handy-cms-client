"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/app/cms/menu/components/MenuList";
import { MenuEditor } from "@/app/cms/menu/components/MenuEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu } from "./types";
import { menuApi } from "./api";
import { toaster } from "@/components/ui/toaster";
import { MenuForm } from "./components/MenuForm";

export default function MenuManagementPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const colors = useColors();
  const bg = useColorModeValue(colors.bg, colors.darkBg);
  const queryClient = useQueryClient();

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

  const emptyMessageColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );
  const badgeBg = useColorModeValue(colors.primary.light, colors.primary.light);
  const badgeColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  // 메뉴 목록 조회
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: menuApi.getMenus,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 신선한 상태로 유지
    gcTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
  });

  // 메뉴 생성
  const createMenuMutation = useMutation({
    mutationFn: (menu: Omit<Menu, "id" | "createdAt" | "updatedAt">) =>
      menuApi.createMenu(menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toaster.success({
        description: "메뉴가 생성되었습니다.",
        duration: 2000,
      });
    },
    onError: (error) => {
      toaster.error({
        description: "메뉴 생성에 실패했습니다.",
        duration: 3000,
      });
    },
  });

  // 메뉴 수정
  const updateMenuMutation = useMutation({
    mutationFn: ({
      id,
      menu,
    }: {
      id: number;
      menu: Omit<Menu, "id" | "createdAt" | "updatedAt">;
    }) => menuApi.updateMenu(id, menu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      setSelectedMenu(null);
      toaster.success({
        description: "메뉴가 수정되었습니다.",
        duration: 2000,
      });
    },
    onError: (error) => {
      toaster.error({
        description: "메뉴 수정에 실패했습니다.",
        duration: 3000,
      });
    },
  });

  // 메뉴 삭제
  const deleteMenuMutation = useMutation({
    mutationFn: menuApi.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toaster.success({
        description: "메뉴가 삭제되었습니다.",
        duration: 2000,
      });
    },
    onError: (error) => {
      toaster.error({
        description: "메뉴 삭제에 실패했습니다.",
        duration: 3000,
      });
    },
  });

  // 메뉴 순서 변경
  const updateMenuOrderMutation = useMutation({
    mutationFn: (menuOrders: { id: number; sortOrder: number }[]) =>
      menuApi.updateMenuOrder(menuOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toaster.success({
        description: "메뉴 순서가 변경되었습니다.",
        duration: 2000,
      });
    },
    onError: (error) => {
      toaster.error({
        description: "메뉴 순서 변경에 실패했습니다.",
        duration: 3000,
      });
    },
  });

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setIsEditorOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedMenu(null);
  };

  const handleDeleteMenu = (id: number) => {
    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      deleteMenuMutation.mutate(id);
    }
  };

  const handleMoveMenu = (
    menuId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => {
    updateMenuOrderMutation.mutate([{ id: menuId, sortOrder: targetId }]);
  };

  const handleSubmit = (menu: Omit<Menu, "id" | "createdAt" | "updatedAt">) => {
    if (selectedMenu) {
      updateMenuMutation.mutate({ id: selectedMenu.id, menu });
    } else {
      createMenuMutation.mutate(menu);
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
              />
            </DndProvider>
          </Box>

          {isEditorOpen ? (
            <Box>
              <MenuEditor
                menu={selectedMenu}
                onClose={handleCloseEditor}
                onDelete={handleDeleteMenu}
              />
            </Box>
          ) : (
            <Flex
              p={8}
              direction="column"
              align="center"
              justify="center"
              borderRadius="xl"
              height="100%"
              gap={4}
              backdropFilter="blur(8px)"
            >
              <Text
                color={emptyMessageColor}
                fontSize="lg"
                fontWeight="medium"
                textAlign="center"
              >
                메뉴를 선택하거나 새 메뉴를 추가하세요.
              </Text>
              <Button
                onClick={handleAddMenu}
                variant="outline"
                borderColor={colors.primary.default}
                color={colors.primary.default}
                _hover={{
                  bg: colors.primary.alpha,
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.3s ease"
              >
                새 메뉴 추가
              </Button>
            </Flex>
          )}

          <Box>
            <Flex
              p={8}
              direction="column"
              align="center"
              justify="center"
              borderRadius="xl"
              height="100%"
              gap={4}
              backdropFilter="blur(8px)"
            >
              <Text
                color={emptyMessageColor}
                fontSize="lg"
                fontWeight="medium"
                textAlign="center"
              >
                미리보기 영역
              </Text>
              <Text
                color={colors.text.secondary}
                fontSize="sm"
                textAlign="center"
              >
                메뉴 구조가 여기에 표시됩니다.
              </Text>
            </Flex>
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
