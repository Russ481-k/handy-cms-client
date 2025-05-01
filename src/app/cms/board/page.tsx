"use client";

import { useState, useEffect } from "react";
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
import { Board } from "@/types/api";
import { PlusIcon } from "lucide-react";
import { getToken } from "@/lib/auth-utils";

interface BoardMenu {
  id: number;
  name: string;
  type: "BOARD";
  url: string;
  targetId: number;
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
  parentId: number | null;
}

interface BoardMaster {
  id: number;
  name: string;
  slug: string;
  type: string;
  useCategory: boolean;
  allowComment: boolean;
  useAttachment: boolean;
  postsPerPage: number;
  createdAt: string;
  updatedAt: string;
}

export default function BoardManagementPage() {
  const colors = useColors();
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [tempBoard, setTempBoard] = useState<Board | null>(null);
  const [loadingBoardId, setLoadingBoardId] = useState<number | null>(null);
  const [boardMenus, setBoardMenus] = useState<BoardMenu[]>([]);
  const [boardMasters, setBoardMasters] = useState<BoardMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 게시판 메뉴 조회
        const menuResponse = await fetch("/api/v1/cms/menu/type/BOARD", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const menuData = await menuResponse.json();
        setBoardMenus(menuData);
        console.log("Board Menus:", menuData);

        // 게시판 마스터 조회
        const masterResponse = await fetch("/api/v1/cms/bbs/master", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const masterData = await masterResponse.json();
        setBoardMasters(masterData);
        console.log("Board Masters:", masterData);

        // 매칭된 데이터 출력
        const matchedData = menuData.map((menu: BoardMenu) => {
          const master = masterData.find(
            (m: BoardMaster) => m.id === menu.targetId
          );
          return {
            menu,
            master,
          };
        });
        console.log("Matched Board Data:", matchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box p={4}>
        <Spinner />
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
            <Text mb={2}>게시판 메뉴 수: {boardMenus.length}</Text>
            <Text mb={2}>게시판 마스터 수: {boardMasters.length}</Text>
          </Box>

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
