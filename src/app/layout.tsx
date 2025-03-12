import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "Handy CMS",
  description: "Handy Content Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
