"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/components/menu/MenuList";
import { MenuEditor } from "@/components/menu/MenuEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export default function MenuManagementPage() {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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

  const emptyMessageColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );
  const badgeBg = useColorModeValue(colors.primary.light, colors.primary.light);
  const badgeColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

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

  const handleDeleteMenu = async (menuId: number) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu");
      }

      // 메뉴 목록 새로고침을 위해 MenuList 컴포넌트를 다시 렌더링
      const menuListElement = document.querySelector(
        '[data-testid="menu-list"]'
      );
      if (menuListElement) {
        menuListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to delete menu:", error);
      alert("메뉴 삭제 중 오류가 발생했습니다.");
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
              <MenuList onEditMenu={handleEditMenu} />
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
