"use client";

import {
  Box,
  Flex,
  Button,
  VStack,
  Heading,
  Text,
  Input,
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toaster } from "@/components/ui/toaster";

interface Content {
  id: number;
  title: string;
  type: "PAGE" | "POST" | "NOTICE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  body?: string;
}

interface ContentEditorProps {
  content: Content | null;
  onClose: () => void;
  onSave: (
    content: Omit<Content, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const contentSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  type: z.enum(["PAGE", "POST", "NOTICE"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  author: z.string(),
  body: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

export function ContentEditor({
  content,
  onClose,
  onSave,
}: ContentEditorProps) {
  const colors = useColors();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: content?.title || "",
      type: content?.type || "POST",
      status: content?.status || "DRAFT",
      author: content?.author || "",
      body: content?.body || "",
    },
  });

  // 컬러 모드에 맞는 색상 설정
  const bgColor = useColorModeValue(colors.cardBg, colors.cardBg);
  const borderColor = useColorModeValue(colors.border, colors.border);
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const errorColor = useColorModeValue("red.500", "red.300");
  const buttonBg = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  // 셀렉트 박스 스타일
  const selectStyle = {
    width: "100%",
    padding: "0.5rem",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    borderColor: "inherit",
    backgroundColor: "transparent",
  };

  const onSubmit = async (data: ContentFormData) => {
    try {
      await onSave(data);
      toaster.success({
        title: content
          ? "컨텐츠가 수정되었습니다."
          : "컨텐츠가 생성되었습니다.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save content:", error);
      toaster.error({
        title: "컨텐츠 저장에 실패했습니다.",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={3} align="stretch">
          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                제목
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.title ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.title && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.title.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                유형
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <NativeSelect.Root>
                  <NativeSelect.Field {...field} style={selectStyle}>
                    <option value="PAGE">페이지</option>
                    <option value="POST">게시글</option>
                    <option value="NOTICE">공지사항</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
            />
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                상태
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <NativeSelect.Root>
                  <NativeSelect.Field {...field} style={selectStyle}>
                    <option value="DRAFT">임시저장</option>
                    <option value="PUBLISHED">발행</option>
                    <option value="ARCHIVED">보관</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
            />
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                작성자
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.author ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                  readOnly
                />
              )}
            />
            {errors.author && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.author.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                내용
              </Text>
            </Flex>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  borderColor={errors.body ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                  rows={10}
                />
              )}
            />
            {errors.body && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.body.message}
              </Text>
            )}
          </Box>

          <Flex justify="space-between" gap={2} mt={4}>
            <Button
              borderColor={borderColor}
              color={textColor}
              onClick={onClose}
              variant="outline"
              _hover={{ bg: colors.secondary.hover }}
            >
              취소
            </Button>
            <Button
              type="submit"
              bg={buttonBg}
              color="white"
              _hover={{ bg: colors.primary.hover }}
            >
              {content ? "수정" : "생성"}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
