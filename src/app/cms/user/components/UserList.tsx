"use client";

import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "@/components/ui/color-mode";

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

interface UserListProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

export function UserList({ onEditUser, onDeleteUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const borderColor = useColorModeValue(colors.border, colors.border);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toaster.error({
        title: "사용자 로드 실패",
        description: "사용자 데이터를 불러오는데 실패했습니다.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchUsers();
    };

    window.addEventListener("refreshUserList", handleRefresh);
    return () => {
      window.removeEventListener("refreshUserList", handleRefresh);
    };
  }, []);

  return (
    <VStack gap={4} align="stretch">
      {users.map((user) => (
        <Box
          key={user.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          bg="transparent"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <HStack gap={2}>
              <Text fontSize="lg" fontWeight="medium" color={textColor}>
                {user.username}
              </Text>
              <Badge
                colorScheme={
                  user.role === "ADMIN"
                    ? "red"
                    : user.role === "EDITOR"
                    ? "blue"
                    : "green"
                }
              >
                {user.role === "ADMIN"
                  ? "관리자"
                  : user.role === "EDITOR"
                  ? "편집자"
                  : "사용자"}
              </Badge>
              <Badge
                colorScheme={
                  user.status === "ACTIVE"
                    ? "green"
                    : user.status === "INACTIVE"
                    ? "yellow"
                    : "red"
                }
              >
                {user.status === "ACTIVE"
                  ? "활성"
                  : user.status === "INACTIVE"
                  ? "비활성"
                  : "정지"}
              </Badge>
            </HStack>
            <HStack gap={2}>
              <IconButton
                aria-label="Edit user"
                size="sm"
                variant="ghost"
                onClick={() => onEditUser(user)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuPencil />
              </IconButton>
              <IconButton
                aria-label="Delete user"
                size="sm"
                variant="ghost"
                onClick={() => onDeleteUser(user.id)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuTrash />
              </IconButton>
            </HStack>
          </Flex>
          <HStack gap={4} mb={2}>
            <Text fontSize="sm" color={textColor}>
              이메일: {user.email}
            </Text>
            {user.lastLoginAt && (
              <Text fontSize="sm" color={textColor}>
                마지막 로그인: {new Date(user.lastLoginAt).toLocaleString()}
              </Text>
            )}
          </HStack>
          <Text fontSize="sm" color={textColor}>
            가입일: {new Date(user.createdAt).toLocaleString()}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
