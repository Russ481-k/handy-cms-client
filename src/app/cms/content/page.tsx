"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

interface Content {
  id: number;
  title: string;
  type: "PAGE" | "POST" | "NOTICE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function ContentManagementPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
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

  const handleAddContent = () => {
    setSelectedContent(null);
    setIsEditorOpen(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedContent(null);
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      // 컨텐츠 목록 새로고침
      const contentListElement = document.querySelector(
        '[data-testid="content-list"]'
      );
      if (contentListElement) {
        contentListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
      alert("컨텐츠 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSaveContent = async (
    contentData: Omit<Content, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/content", {
        method: selectedContent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedContent
            ? { ...contentData, id: selectedContent.id }
            : contentData
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      // 컨텐츠 목록 새로고침
      const contentListElement = document.querySelector(
        '[data-testid="content-list"]'
      );
      if (contentListElement) {
        contentListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      throw error;
    }
  };

  // 컨텐츠 관리 페이지 레이아웃 정의
  const contentLayout = [
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
      id: "contentList",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      title: "컨텐츠 목록",
      subtitle: "컨텐츠를 선택하여 상세 정보를 확인하거나 수정할 수 있습니다.",
    },
    {
      id: "contentEditor",
      x: 0,
      y: 6,
      w: 3,
      h: 6,
      title: "컨텐츠 편집",
      subtitle: "컨텐츠의 상세 정보를 수정할 수 있습니다.",
    },
    {
      id: "preview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "미리보기",
      subtitle: "컨텐츠의 실제 모습을 미리 확인할 수 있습니다.",
    },
  ];

  return (
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={contentLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading size="lg" color={headingColor} letterSpacing="tight">
                컨텐츠 관리
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
              onClick={handleAddContent}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              shadow={colors.shadow.sm}
              transition="all 0.3s ease"
              size="sm"
            >
              새 컨텐츠 추가
            </Button>
          </Flex>

          <Box>
            {/* ContentList 컴포넌트가 여기에 들어갈 예정 */}
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
                컨텐츠 목록이 여기에 표시됩니다.
              </Text>
            </Flex>
          </Box>

          {isEditorOpen ? (
            <Box>
              {/* ContentEditor 컴포넌트가 여기에 들어갈 예정 */}
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
                  컨텐츠 편집 폼이 여기에 표시됩니다.
                </Text>
              </Flex>
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
                color={colors.text.secondary}
                fontSize="lg"
                fontWeight="medium"
                textAlign="center"
              >
                컨텐츠를 선택하거나 새 컨텐츠를 추가하세요.
              </Text>
              <Button
                onClick={handleAddContent}
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
                새 컨텐츠 추가
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
                color={colors.text.secondary}
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
                선택한 컨텐츠의 실제 모습이 여기에 표시됩니다.
              </Text>
            </Flex>
          </Box>
        </GridSection>
      </Box>
    </Box>
  );
}
