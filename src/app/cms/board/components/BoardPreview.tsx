"use client";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { useColorMode } from "@/components/ui/color-mode";
import { Board } from "../types";
import { Menu } from "../../menu/page";
import { PreviewLayout } from "../../components/preview/PreviewLayout";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useMemo } from "react";
import type { ColDef, CellStyle } from "ag-grid-community";
import { LuPlus } from "react-icons/lu";

interface BoardPreviewProps {
  board: Board | null;
  settings?: {
    showTitle: boolean;
    showSearch: boolean;
    showPagination: boolean;
    showWriteButton: boolean;
    layout: "list" | "grid" | "gallery";
  };
  menus?: Menu[];
}

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
}

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "샘플 게시글 제목입니다",
    author: "작성자",
    date: "2024-03-21",
    views: 42,
  },
  {
    id: 2,
    title: "두 번째 샘플 게시글",
    author: "작성자2",
    date: "2024-03-20",
    views: 31,
  },
  {
    id: 3,
    title: "세 번째 게시글 입니다",
    author: "작성자3",
    date: "2024-03-19",
    views: 15,
  },
];

// 기본 설정값 추가
const DEFAULT_SETTINGS = {
  showTitle: true,
  showSearch: true,
  showPagination: true,
  showWriteButton: true,
  layout: "list" as const,
};

export function BoardPreview({
  board,
  settings = DEFAULT_SETTINGS,
  menus = [],
}: BoardPreviewProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [rowData] = useState<Post[]>(SAMPLE_POSTS);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef<Post>[]>(
    () => [
      {
        field: "title",
        headerName: "제목",
        flex: 2,
        cellStyle: {
          cursor: "pointer",
          color: isDark ? colors.text.primary : colors.text.primary,
        } as CellStyle,
        onCellClicked: (params) => {
          console.log("게시글 클릭:", params.data);
        },
      },
      {
        field: "author",
        headerName: "작성자",
        flex: 1,
        cellStyle: {
          color: isDark ? colors.text.secondary : colors.text.secondary,
        } as CellStyle,
      },
      {
        field: "date",
        headerName: "작성일",
        flex: 1,
        cellStyle: {
          color: isDark ? colors.text.secondary : colors.text.secondary,
        } as CellStyle,
      },
      {
        field: "views",
        headerName: "조회",
        flex: 1,
        type: "numericColumn",
        cellStyle: {
          color: isDark ? colors.text.secondary : colors.text.secondary,
        } as CellStyle,
      },
    ],
    [isDark, colors]
  );

  // AG Grid 기본 설정
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const gridTheme = isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine";

  if (!board) {
    return (
      <PreviewLayout menus={menus}>
        <Box p={6} textAlign="center" color="gray.500">
          게시판을 선택해주세요.
        </Box>
      </PreviewLayout>
    );
  }

  return (
    <PreviewLayout currentPage="게시판" menus={menus}>
      <Box
        width="100%"
        height="100%"
        bg={isDark ? "gray.900" : "white"}
        position="relative"
      >
        {/* 타이틀 영역 */}
        <Box
          width="100%"
          bg={isDark ? "gray.800" : "gray.50"}
          py={8}
          borderBottom="1px solid"
          borderColor={isDark ? "gray.700" : "gray.100"}
        >
          <Box px={6} maxW="container.lg" mx="auto">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {board.title}
            </Text>
            {board.description && (
              <Text fontSize="sm" color={colors.text.secondary}>
                {board.description}
              </Text>
            )}
          </Box>
        </Box>

        {/* 메인 컨텐츠 */}
        <Box py={8}>
          <Box maxW="container.lg" mx="auto" px={6}>
            {/* 검색 영역 */}
            {settings.showSearch && (
              <HStack mb={6} gap={2}>
                <Input placeholder="검색어를 입력하세요" size="sm" />
                <Button size="sm" colorScheme="blue">
                  검색
                </Button>
              </HStack>
            )}

            {/* AG Grid 게시글 목록 */}
            <Box
              className={gridTheme}
              width="100%"
              height="400px"
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
              mb={4}
            >
              <AgGridReact<Post>
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                pagination={settings.showPagination}
                paginationAutoPageSize={true}
                suppressCellFocus={true}
                domLayout="autoHeight"
              />
            </Box>

            {/* 하단 영역 (글쓰기 버튼) */}
            <Flex justify="flex-end">
              {settings.showWriteButton && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <LuPlus />
                  글쓰기
                </Button>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </PreviewLayout>
  );
}
