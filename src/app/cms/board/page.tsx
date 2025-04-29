"use client";

import { useState } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { BoardList } from "./components/BoardList";
import { BoardEditor } from "./components/BoardEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { toaster } from "@/components/ui/toaster";
import { BoardPreview } from "./components/BoardPreview";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { boardApi, boardKeys } from "@/lib/api/board";
import { Board } from "@/types/api";

export default function BoardManagementPage() {
  const colors = useColors();
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [tempBoard, setTempBoard] = useState<Board | null>(null);
  const [loadingBoardId, setLoadingBoardId] = useState<number | null>(null);

  const bg = useColorModeValue(colors.bg, colors.darkBg);
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

  const queryClient = useQueryClient();

  const { data: apiResponse, isLoading: isBoardsLoading } = useQuery({
    queryKey: boardKeys.all,
    queryFn: boardApi.getBoards,
  });

  const boards = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.data || [];

  const saveBoardMutation = useMutation({
    mutationFn: boardApi.saveBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      toaster.create({
        title: tempBoard
          ? "게시판이 생성되었습니다."
          : "게시판이 수정되었습니다.",
        type: "success",
      });
      setTempBoard(null);
      setSelectedBoard(null);
    },
    onError: () => {
      toaster.create({
        title: "게시판 저장에 실패했습니다.",
        type: "error",
      });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: boardApi.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      toaster.create({
        title: "게시판이 삭제되었습니다.",
        type: "success",
      });
      setSelectedBoard(null);
    },
    onError: () => {
      toaster.create({
        title: "게시판 삭제에 실패했습니다.",
        type: "error",
      });
    },
  });

  const handleAddBoard = () => {
    const newBoard: Board = {
      id: Date.now(),
      bbsName: "새 게시판",
      skinType: "BASIC",
      manager: {
        name: "",
        email: "",
      },
      alarm: {
        mail: false,
        kakao: false,
        internal: false,
      },
      topContent: "",
      bottomContent: "",
      auth: {
        read: "PUBLIC",
        write: "STAFF",
        admin: "ADMIN",
      },
      displayYn: true,
      sortOrder: 0,
      extraSchema: {
        attachmentLimit: 0,
        category: false,
        formDownloadYn: false,
        customFields: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTempBoard(newBoard);
    setSelectedBoard(newBoard);
  };

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setTempBoard(null);
  };

  const handleDeleteBoard = async (boardId: number) => {
    try {
      setLoadingBoardId(boardId);
      if (tempBoard && tempBoard.id === boardId) {
        setTempBoard(null);
        setSelectedBoard(null);
      } else {
        await deleteBoardMutation.mutateAsync(boardId);
      }
    } finally {
      setLoadingBoardId(null);
    }
  };

  const handleSubmit = async (
    boardData: Omit<Board, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const boardId = tempBoard ? undefined : selectedBoard?.id;
      if (boardId !== undefined) {
        setLoadingBoardId(boardId);
      }
      await saveBoardMutation.mutateAsync({
        id: boardId,
        boardData,
      });
    } finally {
      setLoadingBoardId(null);
    }
  };

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
              _hover={{
                bg: buttonHoverBg,
                transform: "translateY(-2px)",
              }}
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
              boards={boards}
              onAddBoard={handleAddBoard}
              onEditBoard={handleEditBoard}
              onDeleteBoard={handleDeleteBoard}
              isLoading={isBoardsLoading}
              selectedBoardId={selectedBoard?.id}
              loadingBoardId={loadingBoardId}
            />
          </Box>

          <Box>
            <BoardEditor
              board={selectedBoard}
              onSubmit={handleSubmit}
              isLoading={loadingBoardId !== null}
            />
          </Box>

          <Box>
            <BoardPreview board={selectedBoard} />
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
