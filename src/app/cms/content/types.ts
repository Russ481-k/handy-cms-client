import { TreeItem } from "@/components/ui/tree-list";

export interface Content extends TreeItem {
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  settings: {
    layout: "default" | "wide" | "full";
    showThumbnail: boolean;
    showTags: boolean;
    showDate: boolean;
    showAuthor: boolean;
    showRelatedContent: boolean;
  };
}

export function convertTreeItemToContent(
  item: TreeItem | null
): Content | null {
  if (!item) return null;

  return {
    ...item,
    title: item.name,
    description: "",
    content: "",
    status: item.visible ? "PUBLISHED" : "DRAFT",
    settings: {
      layout: "default",
      showThumbnail: true,
      showTags: true,
      showDate: true,
      showAuthor: true,
      showRelatedContent: true,
    },
  };
}
