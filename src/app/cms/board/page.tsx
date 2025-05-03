"use client";

import { useState } from "react";
import { Box, Flex, Heading, Badge, Text, Spinner } from "@chakra-ui/react";
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
import { Board, Menu, BoardMasterApiResponse } from "@/types/api";
import { PlusIcon } from "lucide-react";
import { privateApi } from "@/lib/api/client";
import { menuApi } from "@/lib/api/menu";

export default function BoardManagementPage() {
  const colors = useColors();
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [tempBoard, setTempBoard] = useState<Board | null>(null);
  const [loadingBoardId, setLoadingBoardId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const { data: apiResponse, isLoading: isBoardsLoading } = useQuery<Board[]>({
    queryKey: boardKeys.all,
    queryFn: boardApi.getBoards,
  });

  const boards = apiResponse || [];
  console.log(boards);
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

  // 게시판 메뉴 조회
  const { data: boardMenusResponse, isLoading: isBoardMenusLoading } = useQuery<
    Menu[]
  >({
    queryKey: ["boardMenus"],
    queryFn: async () => {
      const response = await menuApi.getMenusByType("BOARD");
      return (response as any).content;
    },
  });

  // 게시판 마스터 조회
  const { data: boardMastersResponse, isLoading: isBoardMastersLoading } =
    useQuery<BoardMasterApiResponse>({
      queryKey: ["boardMasters"],
      queryFn: () => boardApi.getBoardMasters(),
    });

  // 매칭된 데이터
  const matchedBoards: Board[] = boardMastersResponse?.data?.content
    ? boardMastersResponse.data.content.map(
        (master: {
          bbsId: number;
          bbsName: string;
          skinType: "BASIC" | "FAQ" | "QNA" | "PRESS" | "FORM";
          readAuth: string;
          writeAuth: string;
        }) => ({
          id: master.bbsId,
          bbsName: master.bbsName,
          skinType: master.skinType,
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
            read: master.readAuth,
            write: master.writeAuth,
            admin: "ADMIN",
          },
          displayYn: true,
          sortOrder: 0,
          extraSchema: {
            attachmentLimit: 5,
            category: false,
            formDownloadYn: false,
            customFields: [],
          },
          createdAt: "",
          updatedAt: "",
        })
      )
    : [];

  const handleAddBoard = () => {
    setSelectedBoard(null);
    setIsEditorOpen(true);
  };

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setIsEditorOpen(true);
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

  const handleCloseEditor = () => {
    setSelectedBoard(null);
    setIsEditorOpen(false);
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

  // 모든 데이터 로딩이 완료되었는지 확인
  const isLoading =
    isBoardsLoading || isBoardMenusLoading || isBoardMastersLoading;

  if (isLoading) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Spinner size="xl" color={colors.primary.default} />
      </Box>
    );
  }

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
              <PlusIcon />
              게시판 추가
            </Button>
          </Flex>

          <Box>
            <BoardList
              boards={matchedBoards}
              onAddBoard={handleAddBoard}
              onEditBoard={handleEditBoard}
              onDeleteBoard={handleDeleteBoard}
              isLoading={isBoardMastersLoading}
              selectedBoardId={selectedBoard?.id}
              loadingBoardId={loadingBoardId}
            />
                      <Text mb={2}>게시판 메뉴 목록:</Text>
            {boardMenusResponse?.map((menu: Menu) => (
              <Box
                key={menu.id}
                p={2}
                borderWidth="1px"
                borderRadius="md"
                mb={2}
              >
                <Text fontWeight="bold">{menu.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  URL: {menu.url}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  표시 위치: {menu.displayPosition}
                </Text>
              </Box>
            ))}
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
