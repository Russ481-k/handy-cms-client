"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardPage from "./dashboard/page";
import { useAuth } from "@/lib/AuthContext";

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

  return <DashboardPage />;
}
