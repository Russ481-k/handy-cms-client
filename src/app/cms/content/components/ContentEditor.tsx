"use client";

import { useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Text,
  Checkbox,
  Input,
  Select,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { LuCheck } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TreeItem } from "@/components/ui/tree-list";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";

interface ContentEditorProps {
  content?: TreeItem | null;
  onClose: () => void;
  onDelete?: (contentId: number) => void;
  onSubmit: (content: Omit<TreeItem, "id" | "createdAt" | "updatedAt">) => void;
}

const contentSchema = z.object({
  name: z.string().min(1, "컨텐츠명을 입력해주세요."),
  url: z.string().min(1, "URL을 입력해주세요."),
  visible: z.boolean().default(true),
  type: z.literal("CONTENT"),
  displayPosition: z.string().min(1, "표시 위치를 선택해주세요."),
});

type ContentFormData = z.infer<typeof contentSchema>;

export function ContentEditor({
  content,
  onClose,
  onDelete,
  onSubmit,
}: ContentEditorProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      name: content?.name || "",
      url: content?.url || "",
      visible: content?.visible ?? true,
      type: "CONTENT",
      displayPosition: content?.displayPosition || "TOP",
    },
  });

  // content prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (content) {
      reset({
        name: content.name,
        url: content.url || "",
        visible: content.visible,
        type: "CONTENT",
        displayPosition: content.displayPosition,
      });
    } else {
      reset({
        name: "",
        url: "",
        visible: true,
        type: "CONTENT",
        displayPosition: "TOP",
      });
    }
  }, [content, reset]);

  // 컬러 모드에 맞는 색상 설정
  const colors = useColors();
  const bgColor = useColorModeValue(colors.cardBg, colors.cardBg);
  const borderColor = useColorModeValue(colors.border, colors.border);
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const errorColor = useColorModeValue("red.500", "red.300");
  const buttonBg = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  const handleDelete = async () => {
    if (!content || !onDelete) return;

    if (window.confirm("정말로 이 컨텐츠를 삭제하시겠습니까?")) {
      onDelete(content.id);
      onClose();
    }
  };

  const handleFormSubmit = async (data: ContentFormData) => {
    try {
      const submitData = {
        ...data,
        sortOrder: content?.sortOrder || 0,
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving content:", error);
      toaster.error({
        title: "컨텐츠 저장 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  if (!content && !onDelete) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="full"
        gap={4}
        p={8}
        color={textColor}
      >
        <Text fontSize="lg" fontWeight="medium" textAlign="center">
          컨텐츠를 선택하거나 새 컨텐츠를 추가하세요.
        </Text>
      </Flex>
    );
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack gap={3} align="stretch">
          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                컨텐츠명
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.name ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.name && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                URL
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.url ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.url && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.url.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                표시 위치
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="displayPosition"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderWidth: "1px",
                    borderRadius: "0.375rem",
                    borderColor: errors.displayPosition
                      ? errorColor
                      : borderColor,
                    backgroundColor: "transparent",
                    color: textColor,
                  }}
                >
                  <option value="TOP">상단</option>
                  <option value="BOTTOM">하단</option>
                </select>
              )}
            />
            {errors.displayPosition && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.displayPosition.message}
              </Text>
            )}
          </Box>

          <Flex alignItems="center" gap={2}>
            <Controller
              name="visible"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox.Root
                  checked={value}
                  onCheckedChange={(e) => onChange(!!e.checked)}
                  colorPalette="blue"
                  size="sm"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor={borderColor}
                    bg={bgColor}
                    _checked={{
                      borderColor: "transparent",
                      bgGradient: colors.gradient.primary,
                      color: "white",
                      _hover: {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Checkbox.Indicator>
                      <LuCheck />
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Label>
                    <Text fontWeight="medium" color={textColor}>
                      컨텐츠 노출
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              )}
            />
          </Flex>

          <Flex justify="space-between" mt={4}>
            {content ? (
              <Button
                borderColor={colors.accent.delete.default}
                color={colors.accent.delete.default}
                onClick={handleDelete}
                variant="outline"
                _hover={{
                  bg: colors.accent.delete.bg,
                  borderColor: colors.accent.delete.hover,
                  color: colors.accent.delete.hover,
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s ease"
              >
                삭제
              </Button>
            ) : (
              <Box />
            )}
            <Flex gap={2}>
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
                저장
              </Button>
            </Flex>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
