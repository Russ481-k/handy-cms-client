import type { Metadata } from "next";
import { CMSLayoutClient } from "./CMSLayoutClient";
import { RecoilRoot } from "recoil";

export const metadata: Metadata = {
  title: "CMS",
  description: "Content Management System",
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <CMSLayoutClient>{children}</CMSLayoutClient>;
}
