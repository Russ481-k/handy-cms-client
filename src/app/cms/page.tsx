"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import MenuManagementPage from "./menu/page";

export default function Cms() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/cms/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>isLoading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MenuManagementPage />;
}
