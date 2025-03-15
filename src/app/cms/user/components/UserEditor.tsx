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
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toaster } from "@/components/ui/toaster";

interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "USER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserEditorProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

const userSchema = z.object({
  username: z.string().min(1, "사용자명을 입력해주세요."),
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
  role: z.enum(["ADMIN", "EDITOR", "USER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserEditor({ user, onClose, onSave }: UserEditorProps) {
  const colors = useColors();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "USER",
      status: user?.status || "ACTIVE",
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

  const onSubmit = async (data: UserFormData) => {
    try {
      await onSave(data);
      toaster.success({
        title: user ? "사용자가 수정되었습니다." : "사용자가 생성되었습니다.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      toaster.error({
        title: "사용자 저장에 실패했습니다.",
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
                사용자명
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  borderColor={errors.username ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.username && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.username.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                이메일
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  borderColor={errors.email ? errorColor : borderColor}
                  color={textColor}
                  bg="transparent"
                />
              )}
            />
            {errors.email && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.email.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                권한
              </Text>
              <Text fontSize="sm" color={errorColor} ml={1}>
                *
              </Text>
            </Flex>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <NativeSelect.Root>
                  <NativeSelect.Field {...field} style={selectStyle}>
                    <option value="ADMIN">관리자</option>
                    <option value="EDITOR">편집자</option>
                    <option value="USER">일반 사용자</option>
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
                    <option value="ACTIVE">활성</option>
                    <option value="INACTIVE">비활성</option>
                    <option value="SUSPENDED">정지</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
            />
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
              {user ? "수정" : "생성"}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
