"use client";

import { Badge, Text, Box, Spinner, Center, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useColors } from "@/styles/theme";
import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "@/components/ui/color-mode";
import { getAuthHeader } from "@/lib/auth";
import { TreeItem } from "@/components/ui/tree-list";
import { LuInbox, LuFileText } from "react-icons/lu";
import { Menu } from "@/app/cms/menu/page";
import { ListItem } from "@/components/ui/list-item";

export interface ContentListProps {
  menus: TreeItem[];
  onEditContent: (content: TreeItem) => void;
  onDeleteContent: (contentId: number) => void;
  isLoading: boolean;
  selectedContentId?: number;
  refreshContents: () => Promise<void>;
}

export function ContentList({
  menus,
  onEditContent,
  onDeleteContent,
  isLoading,
  selectedContentId,
  refreshContents,
}: ContentListProps) {
  const [error, setError] = useState<string | null>(null);
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const emptyColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );

  const transformMenuToTreeItem = (menu: Menu): TreeItem => {
    return {
      id: menu.id,
      name: menu.name,
      type: menu.type,
      url: menu.url,
      targetId: menu.targetId,
      displayPosition: menu.displayPosition,
      visible: menu.visible,
      sortOrder: menu.sortOrder,
      parentId: menu.parentId,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
      children: menu.children?.map(transformMenuToTreeItem),
    };
  };

  const fetchMenus = async () => {
    try {
      setError(null);
      console.log("Fetching content menus...");
      console.log("Auth header:", getAuthHeader());
      const response = await fetch("/api/cms/menu?type=CONTENT", {
        headers: getAuthHeader(),
      });
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      console.log("Raw content data:", data);
      const transformedData = data.map(transformMenuToTreeItem);
      console.log("Transformed content data:", transformedData);
      return transformedData;
    } catch (error) {
      console.error("Error fetching menus:", error);
      setError("컨텐츠 목록을 불러오는데 실패했습니다.");
      toaster.error({
        title: "컨텐츠 목록을 불러오는데 실패했습니다.",
        duration: 3000,
      });
      return [];
    }
  };

  useEffect(() => {
    console.log("ContentList mounted, fetching menus...");
    fetchMenus().then((data) => {
      // Assuming the data is stored in the state
      // This is a placeholder and should be replaced with actual state management
    });
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("ContentList refresh event received");
      fetchMenus().then((data) => {
        // Assuming the data is stored in the state
        // This is a placeholder and should be replaced with actual state management
      });
    };

    window.addEventListener("refreshContentList", handleRefresh);
    return () => {
      window.removeEventListener("refreshContentList", handleRefresh);
    };
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="full">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Center py={8} flexDirection="column" gap={2}>
        <Text color="red.500">{error}</Text>
        <Badge
          as="button"
          onClick={fetchMenus}
          colorScheme="blue"
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
        >
          다시 시도
        </Badge>
      </Center>
    );
  }

  if (menus.length === 0) {
    return (
      <Center py={8} flexDirection="column" gap={2}>
        <LuInbox size={24} color={emptyColor} />
        <Text color={emptyColor}>등록된 컨텐츠가 없습니다.</Text>
      </Center>
    );
  }

  return (
    <Box>
      {menus.map((menu) => (
        <ListItem
          key={menu.id}
          id={menu.id}
          name={menu.name}
          icon={<LuFileText />}
          isSelected={menu.id === selectedContentId}
          onEdit={() => onEditContent(menu)}
          onDelete={() => onDeleteContent(menu.id)}
          renderBadges={() => !menu.visible && "비활성"}
          onClick={() => onEditContent(menu)}
        />
      ))}
    </Box>
  );
}
