"use client";

import "@/styles/globals.css";
import { Providers } from "./providers";

import { BreadcrumbNav } from "@/components/ui/breadcrumb";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <BreadcrumbNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
