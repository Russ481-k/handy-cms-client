"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { BoardList } from "@/app/cms/board/components/BoardList";
import { BoardEditor } from "@/app/cms/board/components/BoardEditor";
import { BoardPreview } from "@/app/cms/board/components/BoardPreview";
import { toaster } from "@/components/ui/toaster";

interface Board {
  id: number;
  name: string;
  type: "GENERAL" | "GALLERY" | "QNA" | "NOTICE";
  description: string;
  managerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BoardManagementPage() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
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
  const badgeBg = useColorModeValue(colors.primary.light, colors.primary.light);
  const badgeColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  const handleAddBoard = () => {
    setSelectedBoard(null);
    setIsEditorOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedBoard(null);
  };

  const handleDeleteBoard = async (board: Board) => {
    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }

      // 게시판 목록 새로고침
      window.dispatchEvent(new Event("refreshBoardList"));

      toaster.success({
        title: "게시판 삭제 완료",
        description: "게시판이 성공적으로 삭제되었습니다.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to delete board:", error);
      toaster.error({
        title: "게시판 삭제 실패",
        description: "게시판 삭제 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  const handleSaveBoard = async (
    boardData: Omit<Board, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/boards", {
        method: selectedBoard ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedBoard ? { ...boardData, id: selectedBoard.id } : boardData
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save board");
      }

      // 게시판 목록 새로고침
      const boardListElement = document.querySelector(
        '[data-testid="board-list"]'
      );
      if (boardListElement) {
        boardListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to save board:", error);
      throw error;
    }
  };

  // 게시판 관리 페이지 레이아웃 정의
  const boardLayout = [
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
      id: "boardList",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      title: "게시판 목록",
      subtitle: "게시판을 선택하여 상세 정보를 확인하거나 수정할 수 있습니다.",
    },
    {
      id: "boardEditor",
      x: 0,
      y: 6,
      w: 3,
      h: 6,
      title: "게시판 편집",
      subtitle: "게시판의 상세 정보를 수정할 수 있습니다.",
    },
    {
      id: "preview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "미리보기",
      subtitle: "게시판의 실제 모습을 미리 확인할 수 있습니다.",
    },
  ];

  return (
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={boardLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading size="lg" color={headingColor} letterSpacing="tight">
                게시판 관리
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
              onClick={handleAddBoard}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              shadow={colors.shadow.sm}
              transition="all 0.3s ease"
              size="sm"
            >
              새 게시판 추가
            </Button>
          </Flex>

          <BoardList
            onEditBoard={handleEditBoard}
            onDeleteBoard={handleDeleteBoard}
          />

          {isEditorOpen ? (
            <BoardEditor
              board={selectedBoard}
              onClose={handleCloseEditor}
              onSave={handleSaveBoard}
            />
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
                color={colors.text.secondary}
                fontSize="lg"
                fontWeight="medium"
                textAlign="center"
              >
                게시판을 선택하거나 새 게시판을 추가하세요.
              </Text>
              <Button
                onClick={handleAddBoard}
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
                새 게시판 추가
              </Button>
            </Flex>
          )}

          <BoardPreview board={selectedBoard} />
        </GridSection>
      </Box>
    </Box>
  );
}
