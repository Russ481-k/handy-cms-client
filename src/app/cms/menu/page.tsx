"use client";

import { useState } from "react";
import { Box, Flex, Heading, Container, Text, Badge } from "@chakra-ui/react";
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

  // 메뉴 관리 페이지 레이아웃 정의
  const menuLayout = [
    { id: "header", x: 0, y: 0, w: 12, h: 1, isStatic: true, isHeader: true },
    { id: "menuList", x: 0, y: 1, w: 4, h: 12 },
    { id: "menuEditor", x: 4, y: 1, w: 8, h: 12 },
  ];

  return (
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Container maxW="container.xl" style={{ paddingInline: 0 }}>
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
              <MenuEditor menu={selectedMenu} onClose={handleCloseEditor} />
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
        </GridSection>
      </Container>
    </Box>
  );
}
