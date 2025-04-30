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
import { Board } from "@/types/api";
import { Menu } from "@/types/api";
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

export function BoardPreview({ board }: BoardPreviewProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  if (!board) {
    return (
      <Box p={4} textAlign="center">
        <Text color={colors.text.secondary}>게시판을 선택하세요</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color={colors.text.primary}>
            {board.bbsName}
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            스킨: {board.skinType}
          </Text>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
            관리자 정보
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            이름: {board.manager.name}
          </Text>
          <Text fontSize="sm" color={colors.text.secondary}>
            이메일: {board.manager.email}
          </Text>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
            알림 설정
          </Text>
          <HStack gap={4}>
            <Badge colorScheme={board.alarm.mail ? "green" : "gray"}>
              이메일 {board.alarm.mail ? "ON" : "OFF"}
            </Badge>
            <Badge colorScheme={board.alarm.kakao ? "green" : "gray"}>
              카카오톡 {board.alarm.kakao ? "ON" : "OFF"}
            </Badge>
            <Badge colorScheme={board.alarm.internal ? "green" : "gray"}>
              내부 {board.alarm.internal ? "ON" : "OFF"}
            </Badge>
          </HStack>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
            권한 설정
          </Text>
          <HStack gap={4}>
            <Badge colorScheme="blue">읽기: {board.auth.read}</Badge>
            <Badge colorScheme="blue">쓰기: {board.auth.write}</Badge>
            <Badge colorScheme="blue">관리: {board.auth.admin}</Badge>
          </HStack>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
            추가 설정
          </Text>
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" color={colors.text.secondary}>
              첨부파일 제한: {board.extraSchema.attachmentLimit}개
            </Text>
            <Text fontSize="sm" color={colors.text.secondary}>
              카테고리 사용: {board.extraSchema.category ? "예" : "아니오"}
            </Text>
            <Text fontSize="sm" color={colors.text.secondary}>
              다운로드 기능:{" "}
              {board.extraSchema.formDownloadYn ? "예" : "아니오"}
            </Text>
          </VStack>
        </Box>

        {board.topContent && (
          <Box>
            <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
              상단 내용
            </Text>
            <Box
              p={2}
              bg={colors.bg}
              borderRadius="md"
              border="1px solid"
              borderColor={colors.border}
            >
              <Text fontSize="sm" color={colors.text.secondary}>
                {board.topContent}
              </Text>
            </Box>
          </Box>
        )}

        {board.bottomContent && (
          <Box>
            <Text fontSize="md" fontWeight="medium" color={colors.text.primary}>
              하단 내용
            </Text>
            <Box
              p={2}
              bg={colors.bg}
              borderRadius="md"
              border="1px solid"
              borderColor={colors.border}
            >
              <Text fontSize="sm" color={colors.text.secondary}>
                {board.bottomContent}
              </Text>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
