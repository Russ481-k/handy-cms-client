"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import MenuManagementPage from "./menu/page";
import { Spinner, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useColors } from "@/styles/theme";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

export default function Cms() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/cms/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg={colors.bg}
        position="relative"
        overflow="hidden"
      >
        {/* Geometric background patterns */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.1}
          zIndex={0}
        >
          <Box
            position="absolute"
            top="20%"
            left="20%"
            width="100px"
            height="100px"
            border="2px solid"
            borderColor={colors.primary.default}
            borderRadius="full"
            animation={`${rotate} 10s linear infinite`}
          />
          <Box
            position="absolute"
            top="60%"
            right="20%"
            width="80px"
            height="80px"
            border="2px solid"
            borderColor={colors.primary.default}
            borderRadius="full"
            animation={`${rotate} 8s linear infinite reverse`}
          />
          <Box
            position="absolute"
            bottom="20%"
            left="40%"
            width="60px"
            height="60px"
            border="2px solid"
            borderColor={colors.primary.default}
            borderRadius="full"
            animation={`${rotate} 6s linear infinite`}
          />
        </Box>

        {/* Main content */}
        <Box position="relative" zIndex={1}>
          <Spinner
            color={colors.primary.default}
            size="xl"
            animation={`${pulse} 2s ease-in-out infinite`}
          />
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MenuManagementPage />;
}
