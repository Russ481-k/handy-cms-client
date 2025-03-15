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
  Checkbox,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toaster } from "@/components/ui/toaster";
import { LuCheck } from "react-icons/lu";

interface Board {
  id: number;
  name: string;
  type: "GENERAL" | "GALLERY" | "QNA" | "NOTICE";
  description: string;
  managerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BoardEditorProps {
  board: Board | null;
  onClose: () => void;
  onSave: (
    board: Omit<Board, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const boardSchema = z.object({
  name: z.string().min(1, "게시판명을 입력해주세요."),
  type: z.enum(["GENERAL", "GALLERY", "QNA", "NOTICE"]),
  description: z.string().min(1, "설명을 입력해주세요."),
  managerId: z.number(),
  isActive: z.boolean().default(true),
});

type BoardFormData = z.infer<typeof boardSchema>;

export function BoardEditor({ board, onClose, onSave }: BoardEditorProps) {
  const colors = useColors();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "",
      type: board?.type || "GENERAL",
      description: board?.description || "",
      managerId: board?.managerId || 1,
      isActive: board?.isActive ?? true,
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

  const onSubmit = async (data: BoardFormData) => {
    try {
      await onSave(data);
      toaster.success({
        title: board ? "게시판이 수정되었습니다." : "게시판이 생성되었습니다.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save board:", error);
      toaster.error({
        title: "게시판 저장에 실패했습니다.",
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
                게시판명
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
                게시판 유형
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
                    <option value="GENERAL">일반 게시판</option>
                    <option value="GALLERY">갤러리 게시판</option>
                    <option value="QNA">Q&A 게시판</option>
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
                설명
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.description ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.description && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.description.message}
              </Text>
            )}
          </Box>

          <Flex alignItems="center">
            <Controller
              name="isActive"
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
                      게시판 활성화
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              )}
            />
          </Flex>

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
              {board ? "수정" : "생성"}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
