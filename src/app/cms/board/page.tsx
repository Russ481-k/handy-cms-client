"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { BoardList } from "./components/BoardList";
import { BoardEditor } from "./components/BoardEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";
import { TreeItem } from "@/components/ui/tree-list";
import { BoardPreview } from "./components/BoardPreview";
import { convertTreeItemToBoard } from "./types";
import { Menu } from "../menu/page";

export default function BoardManagementPage() {
  const [selectedBoard, setSelectedBoard] = useState<TreeItem | null>(null);
  const [boards, setBoards] = useState<TreeItem[]>([]);
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

  // 게시판 목록 새로고침 함수
  const refreshBoards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/menu?type=BOARD", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }
      const data = await response.json();
      console.log("API Response:", data);
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
      toaster.error({
        title: "게시판 목록을 불러오는데 실패했습니다.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBoard = () => {
    setSelectedBoard(null);
  };

  const handleEditBoard = (board: TreeItem) => {
    setSelectedBoard(board);
  };

  const handleCloseEditor = () => {
    setSelectedBoard(null);
  };

  const handleSubmit = async (
    boardData: Omit<TreeItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const url = selectedBoard
        ? `/api/cms/menu/${selectedBoard.id}`
        : "/api/cms/menu";
      const method = selectedBoard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      });

      if (!response.ok) {
        throw new Error("Failed to save board");
      }

      await refreshBoards();
      setSelectedBoard(null);
      toaster.create({
        title: selectedBoard
          ? "게시판이 수정되었습니다."
          : "게시판이 생성되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving board:", error);
      toaster.create({
        title: "게시판 저장에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    try {
      const response = await fetch(`/api/cms/menu/${boardId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }

      await refreshBoards();
      setSelectedBoard(null);
      toaster.create({
        title: "게시판이 삭제되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting board:", error);
      toaster.create({
        title: "게시판 삭제에 실패했습니다.",
        type: "error",
      });
    }
  };

  // 메뉴 목록 불러오기
  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/cms/menu", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toaster.create({
        title: "메뉴 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
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
      subtitle: "등록된 게시판 목록입니다.",
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
      id: "boardPreview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "게시판 미리보기",
      subtitle: "게시판의 미리보기를 확인할 수 있습니다.",
    },
  ];

  // 초기 데이터 로딩
  useEffect(() => {
    refreshBoards();
    fetchMenus();
  }, []);

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

          <Box>
            <BoardList
              menus={boards}
              onEditBoard={handleEditBoard}
              onDeleteBoard={handleDeleteBoard}
              isLoading={isLoading}
              selectedBoardId={selectedBoard?.id}
            />
          </Box>

          <Box>
            <BoardEditor
              board={selectedBoard}
              onClose={handleCloseEditor}
              onDelete={handleDeleteBoard}
              onSubmit={handleSubmit}
            />
          </Box>
          <Box>
            <BoardPreview
              board={
                selectedBoard ? convertTreeItemToBoard(selectedBoard) : null
              }
              menus={menus}
            />
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
