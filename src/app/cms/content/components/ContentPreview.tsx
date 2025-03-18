"use client";

import { Box, Flex, Text, Image, HStack, VStack, Grid } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { useColorMode } from "@/components/ui/color-mode";
import { Content } from "../types";
import { Menu } from "../../menu/page";
import { PreviewLayout } from "../../components/preview/PreviewLayout";
import { LuCalendar, LuEye, LuTag } from "react-icons/lu";

interface ContentPreviewProps {
  content: Content | null;
  menus?: Menu[];
}

const SAMPLE_CONTENT = {
  title: "샘플 컨텐츠 제목",
  description: "이것은 샘플 컨텐츠의 설명입니다.",
  content: `
# 샘플 컨텐츠

이것은 샘플 컨텐츠의 본문입니다. 마크다운 형식으로 작성되었습니다.

## 섹션 1

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

## 섹션 2

샘플 텍스트가 들어갑니다. 이 텍스트는 미리보기용으로만 사용됩니다.
  `,
  thumbnail: "https://via.placeholder.com/800x400",
  tags: ["태그1", "태그2", "태그3"],
  author: {
    name: "작성자",
    avatar: "https://via.placeholder.com/40",
  },
  date: "2024-03-21",
  views: 42,
};

export function ContentPreview({ content, menus = [] }: ContentPreviewProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  if (!content) {
    return (
      <PreviewLayout menus={menus}>
        <Box p={6} textAlign="center" color="gray.500">
          컨텐츠를 선택해주세요.
        </Box>
      </PreviewLayout>
    );
  }

  return (
    <PreviewLayout currentPage="컨텐츠" menus={menus}>
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
              {content.title}
            </Text>
            {content.description && (
              <Text fontSize="sm" color={colors.text.secondary}>
                {content.description}
              </Text>
            )}
          </Box>
        </Box>

        {/* 메인 컨텐츠 */}
        <Box py={8}>
          <Box maxW="container.lg" mx="auto" px={6}>
            {/* 썸네일 */}
            {content.settings.showThumbnail && SAMPLE_CONTENT.thumbnail && (
              <Box
                mb={8}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="sm"
                bg={isDark ? "gray.800" : "white"}
              >
                <Image
                  src={SAMPLE_CONTENT.thumbnail}
                  alt={content.title}
                  width="100%"
                  height="auto"
                />
              </Box>
            )}

            {/* 메타 정보 */}
            <Flex
              justify="space-between"
              align="center"
              mb={8}
              pb={4}
              borderBottom="1px solid"
              borderColor={isDark ? "gray.700" : "gray.100"}
            >
              <HStack gap={4}>
                {content.settings.showAuthor && (
                  <HStack gap={2}>
                    <Box
                      width="32px"
                      height="32px"
                      borderRadius="full"
                      overflow="hidden"
                      bg="gray.200"
                      _dark={{ bg: "gray.700" }}
                    >
                      <Image
                        src={SAMPLE_CONTENT.author.avatar}
                        alt={SAMPLE_CONTENT.author.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    </Box>
                    <Text fontSize="sm">{SAMPLE_CONTENT.author.name}</Text>
                  </HStack>
                )}
                {content.settings.showDate && (
                  <HStack gap={2} color={colors.text.secondary}>
                    <LuCalendar size={16} />
                    <Text fontSize="sm">{SAMPLE_CONTENT.date}</Text>
                  </HStack>
                )}
                <HStack gap={2} color={colors.text.secondary}>
                  <LuEye size={16} />
                  <Text fontSize="sm">{SAMPLE_CONTENT.views}</Text>
                </HStack>
              </HStack>
              {content.settings.showTags && (
                <HStack gap={2}>
                  <LuTag size={16} />
                  {SAMPLE_CONTENT.tags.map((tag) => (
                    <Box
                      key={tag}
                      px={2}
                      py={1}
                      bg="blue.50"
                      color="blue.600"
                      fontSize="sm"
                      borderRadius="md"
                      _dark={{
                        bg: "blue.900",
                        color: "blue.200",
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </HStack>
              )}
            </Flex>

            {/* 본문 */}
            <VStack align="stretch" gap={4} mb={12}>
              {SAMPLE_CONTENT.content.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <Text key={index} fontSize="2xl" fontWeight="bold">
                      {line.replace("# ", "")}
                    </Text>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <Text key={index} fontSize="xl" fontWeight="bold" mt={2}>
                      {line.replace("## ", "")}
                    </Text>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <Text key={index} pl={4}>
                      • {line.replace("- ", "")}
                    </Text>
                  );
                }
                return (
                  <Text key={index} whiteSpace="pre-wrap">
                    {line}
                  </Text>
                );
              })}
            </VStack>

            {/* 관련 컨텐츠 */}
            {content.settings.showRelatedContent && (
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  관련 컨텐츠
                </Text>
                <Grid
                  templateColumns="repeat(3, 1fr)"
                  gap={6}
                  bg={isDark ? "gray.800" : "gray.50"}
                  p={6}
                  borderRadius="lg"
                >
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      bg={isDark ? "gray.700" : "white"}
                      p={4}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                      transition="all 0.2s"
                    >
                      <Text fontWeight="bold" mb={2}>
                        관련 컨텐츠 {i}
                      </Text>
                      <Text fontSize="sm" color={colors.text.secondary}>
                        관련 컨텐츠 {i}의 설명입니다.
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </PreviewLayout>
  );
}
