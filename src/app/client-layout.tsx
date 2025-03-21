"use client";

import { Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BreadcrumbNav = dynamic(
  () => import("@/components/ui/breadcrumb").then((mod) => mod.BreadcrumbNav),
  {
    ssr: false,
  }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isCmsPath = pathname?.startsWith("/cms");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box>
      {mounted && !isCmsPath && <BreadcrumbNav />}
      <Box as="main">{children}</Box>
    </Box>
  );
}
