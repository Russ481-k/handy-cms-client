"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import MenuManagementPage from "./menu/page";
import { Spinner, Box } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";

export default function Cms() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/cms/login");
    } else {
      router.push("/cms/menu");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg={colors.bg}
      >
        <Spinner size="xl" color={colors.primary.default} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <></>;
}
