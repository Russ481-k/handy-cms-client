"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { GridSection } from "@/components/ui/grid-section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { UserList } from "@/app/cms/user/components/UserList";
import { UserEditor } from "@/app/cms/user/components/UserEditor";
import { UserPermissions } from "@/app/cms/user/components/UserPermissions";

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

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditorOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // 사용자 목록 새로고침
      const userListElement = document.querySelector(
        '[data-testid="user-list"]'
      );
      if (userListElement) {
        userListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("사용자 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSaveUser = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/users", {
        method: selectedUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          selectedUser ? { ...userData, id: selectedUser.id } : userData
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      // 사용자 목록 새로고침
      const userListElement = document.querySelector(
        '[data-testid="user-list"]'
      );
      if (userListElement) {
        userListElement.dispatchEvent(new Event("refresh"));
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  // 사용자 관리 페이지 레이아웃 정의
  const userLayout = [
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
      id: "userList",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      title: "사용자 목록",
      subtitle: "사용자를 선택하여 상세 정보를 확인하거나 수정할 수 있습니다.",
    },
    {
      id: "userEditor",
      x: 0,
      y: 6,
      w: 3,
      h: 6,
      title: "사용자 편집",
      subtitle: "사용자의 상세 정보를 수정할 수 있습니다.",
    },
    {
      id: "preview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "사용자 권한관리",
      subtitle: "사용자의 권한을 관리할 수 있습니다.",
    },
  ];

  return (
    <Box bg={bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={userLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading size="lg" color={headingColor} letterSpacing="tight">
                사용자 관리
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
                시스템 관리자
              </Badge>
            </Flex>
            <Button
              onClick={handleAddUser}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              shadow={colors.shadow.sm}
              transition="all 0.3s ease"
              size="sm"
            >
              새 사용자 추가
            </Button>
          </Flex>

          <UserList
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />

          {isEditorOpen ? (
            <UserEditor
              user={selectedUser}
              onClose={handleCloseEditor}
              onSave={handleSaveUser}
            />
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
                사용자를 선택하거나 새 사용자를 추가하세요.
              </Text>
              <Button
                onClick={handleAddUser}
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
                새 사용자 추가
              </Button>
            </Flex>
          )}

          {selectedUser && (
            <UserPermissions
              user={{
                id: selectedUser.id,
                username: selectedUser.username,
                role: selectedUser.role,
              }}
            />
          )}
        </GridSection>
      </Box>
    </Box>
  );
}
