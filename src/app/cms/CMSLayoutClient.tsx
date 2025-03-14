"use client";

import { Flex, Box } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { useAuth } from "@/lib/AuthContext";

function CMSLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/cms/login";
  const isCMSRoot = pathname === "/cms";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // 로그인 페이지에서 이미 인증된 경우 대시보드로 이동
    if (isLoginPage && isAuthenticated) {
      router.replace("/cms/dashboard");
      return;
    }

    // CMS 루트 페이지 접근 시 처리
    if (isCMSRoot) {
      if (isAuthenticated) {
        router.replace("/cms/dashboard");
      } else {
        router.replace("/cms/login");
      }
      return;
    }

    // 로그인 페이지가 아닌 다른 페이지에서 인증되지 않은 경우 로그인 페이지로 이동
    if (!isLoginPage && !isAuthenticated) {
      router.replace("/cms/login");
    }
  }, [isLoginPage, isCMSRoot, isAuthenticated, loading, router]);

  // 로딩 중이거나 인증되지 않은 경우 또는 로그인 페이지인 경우 사이드바 없이 컨텐츠만 표시
  if (loading || !isAuthenticated || isLoginPage) {
    return children;
  }

  // 인증된 경우에만 사이드바와 함께 컨텐츠 표시
  return (
    <Flex minH="100vh">
      <Box flex="1">{children}</Box>
    </Flex>
  );
}

export function CMSLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CMSLayoutContent>{children}</CMSLayoutContent>
    </AuthProvider>
  );
}
