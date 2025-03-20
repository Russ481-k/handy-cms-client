"use client";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  HStack,
  VStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { useColorMode } from "@/components/ui/color-mode";
import { Board } from "../types";
import { Menu } from "../../menu/page";
import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";
import {
  type ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
  CellClassParams,
} from "ag-grid-community";
import {
  LuPlus,
  LuSearch,
  LuFileText,
  LuUser,
  LuCalendar,
  LuEye,
} from "react-icons/lu";
import {
  defaultGridOptions,
  themeDarkMode,
  themeLightMode,
} from "@/lib/ag-grid-config";
import Layout from "@/components/layout/view/Layout";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
}: BoardPreviewProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [rowData] = useState<Post[]>(SAMPLE_POSTS);

  // AG Grid 테마 설정
  const gridTheme = useMemo(
    () =>
      themeQuartz
        .withPart(isDark ? colorSchemeDark : colorSchemeLight)
        .withParams({
          // 기본 색상
          backgroundColor: isDark ? colors.darkBg : colors.bg,
          foregroundColor: colors.text.primary,
          accentColor: colors.primary.default,

          // 헤더 관련
          headerBackgroundColor: isDark ? colors.cardBg : colors.bg,
          headerTextColor: colors.text.primary,

          // 행 관련
          oddRowBackgroundColor: isDark ? colors.cardBg : colors.bg,
          rowHoverColor: isDark ? colors.primary.alpha : colors.primary.light,
          selectedRowBackgroundColor: isDark
            ? colors.primary.dark
            : colors.primary.light,

          // 셀 관련
          cellTextColor: colors.text.primary,
          borderColor: colors.border,

          // 기타 UI 요소
          chromeBackgroundColor: isDark ? colors.cardBg : colors.bg,
          inputBackgroundColor: isDark ? colors.cardBg : colors.bg,
          inputTextColor: colors.text.primary,
          inputBorder: colors.border,
        }),
    [isDark, colors]
  );

  console.log(gridTheme);
  // AG Grid 컬럼 설정
  const columnDefs = useMemo<ColDef<Post>[]>(
    () => [
      {
        field: "title",
        headerName: "제목",
        flex: 2,
        cellRenderer: (params: CellClassParams) => (
          <Flex align="center" gap={2} height="100%">
            <Icon as={LuFileText} color={colors.primary.default} />
            <Text
              _hover={{
                color: colors.primary.default,
                transform: "translateX(4px)",
              }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => console.log("게시글 클릭:", params.data)}
            >
              {params.value}
            </Text>
          </Flex>
        ),
      },
      {
        field: "author",
        headerName: "작성자",
        flex: 1,
        cellRenderer: (params: CellClassParams) => (
          <Flex align="center" gap={2} height="100%">
            <Icon as={LuUser} color={colors.text.secondary} />
            <Text>{params.value}</Text>
          </Flex>
        ),
      },
      {
        field: "date",
        headerName: "작성일",
        flex: 1,
        cellRenderer: (params: CellClassParams) => (
          <Flex align="center" gap={2} height="100%">
            <Icon as={LuCalendar} color={colors.text.secondary} />
            <Text>{params.value}</Text>
          </Flex>
        ),
      },
      {
        field: "views",
        headerName: "조회",
        flex: 1,
        type: "numericColumn",
        cellRenderer: (params: CellClassParams) => (
          <Flex align="center" gap={2} height="100%">
            <Icon as={LuEye} color={colors.text.secondary} />
            <Text>{params.value}</Text>
          </Flex>
        ),
      },
    ],
    [colors]
  );

  if (!board) {
    return (
      <Layout>
        <Box p={6} textAlign="center" color="gray.500">
          게시판을 선택해주세요.
        </Box>
      </Layout>
    );
  }

  return (
    <Layout currentPage="게시판">
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
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg={isDark ? "gray.700" : "gray.100"}
            opacity={0.1}
            zIndex={0}
          />
          <Box
            px={6}
            maxW="container.lg"
            mx="auto"
            position="relative"
            zIndex={1}
          >
            <VStack align="flex-start" gap={3}>
              <Flex align="center" gap={3}>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  {board.title}
                </Text>
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  fontSize="sm"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  게시판
                </Badge>
              </Flex>
              {board.description && (
                <Text fontSize="sm" color={colors.text.secondary}>
                  {board.description}
                </Text>
              )}
            </VStack>
          </Box>
        </Box>

        {/* 메인 컨텐츠 */}
        <Box py={8}>
          <Box maxW="container.lg" mx="auto" px={6}>
            {/* 검색 영역 */}
            {settings.showSearch && (
              <Box
                mb={6}
                p={4}
                bg={isDark ? "gray.800" : "gray.50"}
                borderRadius="lg"
                boxShadow="sm"
                border="1px solid"
                borderColor={isDark ? "gray.700" : "gray.200"}
              >
                <HStack gap={2}>
                  <Input
                    placeholder="검색어를 입력하세요"
                    size="md"
                    bg={isDark ? "gray.700" : "white"}
                    borderColor={isDark ? "gray.600" : "gray.200"}
                    _hover={{ borderColor: colors.primary.default }}
                    _focus={{ borderColor: colors.primary.default }}
                    borderRadius="full"
                    px={4}
                  />
                  <Button
                    size="md"
                    colorScheme="blue"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    borderRadius="full"
                    px={6}
                    _hover={{
                      transform: "translateY(-1px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={LuSearch} />
                    검색
                  </Button>
                </HStack>
              </Box>
            )}

            {/* AG Grid 게시글 목록 */}
            <Box
              h="full"
              borderRadius="xl"
              overflow="hidden"
              boxShadow={colors.shadow.sm}
            >
              <AgGridReact
                className="ag-theme-quartz"
                theme={colorMode === "dark" ? themeDarkMode : themeLightMode}
                {...defaultGridOptions}
                columnDefs={columnDefs}
                rowData={rowData}
                animateRows
                domLayout="autoHeight"
              />
            </Box>

            {/* 하단 영역 (글쓰기 버튼) */}
            <Flex justify="flex-end">
              {settings.showWriteButton && (
                <Button
                  size="md"
                  colorScheme="blue"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={6}
                  borderRadius="full"
                  boxShadow="sm"
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={LuPlus} />
                  글쓰기
                </Button>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
