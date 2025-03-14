"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardPage from "./dashboard/page";
import { useAuth } from "@/lib/AuthContext";

export default function Cms() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/cms/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardPage />;
}
