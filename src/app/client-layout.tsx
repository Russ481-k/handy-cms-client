"use client";

import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isCmsPath = pathname?.startsWith("/cms");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main>{children}</main>;
  }

  return (
    <>
      {!isCmsPath && <BreadcrumbNav />}
      <main>{children}</main>
    </>
  );
}
