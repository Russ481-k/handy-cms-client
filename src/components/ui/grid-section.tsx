"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import { LuGrip } from "react-icons/lu";
import * as React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import { css, Global } from "@emotion/react";
import { useColors } from "@/styles/theme";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridSectionProps {
  children: React.ReactNode;
  initialLayout?: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
}

export function GridSection({
  children,
  initialLayout = [
    { id: "a", x: 0, y: 0, w: 6, h: 4 },
    { id: "b", x: 6, y: 0, w: 6, h: 4 },
    { id: "c", x: 0, y: 4, w: 6, h: 4 },
    { id: "d", x: 6, y: 4, w: 6, h: 4 },
  ],
}: GridSectionProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // 홈페이지 스타일에 맞는 색상 적용
  const bgColor = useColorModeValue(colors.cardBg, colors.cardBg);
  const borderColor = useColorModeValue(colors.border, "whiteAlpha.200");
  const handleColor = useColorModeValue(colors.text.secondary, "whiteAlpha.700");
  const handleHoverColor = useColorModeValue(colors.text.primary, "white");

  const childrenArray = React.Children.toArray(children);

  const [layouts, setLayouts] = useState<Layouts>({
    lg: initialLayout.map(({ id, x, y, w, h }) => ({ i: id, x, y, w, h })),
  });

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <Box width="full">
      <Global
        styles={css`
          .react-resizable-handle {
            opacity: 0.3;
            color: ${isDark ? "#94a3b8" : "#64748b"};
            &:hover {
              opacity: 1;
              color: ${isDark ? "#cbd5e1" : "#475569"};
            }
          }
          .react-grid-item.react-grid-placeholder {
            background: ${isDark ? "#334155" : "#e2e8f0"};
            opacity: 0.2;
            border-radius: 0.75rem;
            transition: all 200ms ease;
          }
          .react-grid-item.react-draggable-dragging {
            transition: none;
            z-index: 100;
            cursor: move;
          }
        `}
      />
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable
        isResizable
        margin={[12, 12]}
        draggableHandle=".drag-handle"
      >
        {initialLayout.map((layout, index) => (
          <Box
            key={layout.id}
            bg={bgColor}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            p="2"
            shadow={colors.shadow.sm}
            transition="all 0.3s ease-in-out"
            _hover={{ 
              shadow: colors.shadow.md,
              borderColor: colors.primary.alpha,
            }}
            position="relative"
            backdropFilter="blur(8px)"
          >
            <IconButton
              className="drag-handle"
              as={LuGrip}
              aria-label="Move section"
              size="2xs"
              variant="ghost"
              position="absolute"
              top="1"
              right="1"
              opacity="0.3"
              cursor="move"
              minW="4"
              h="4"
              color={handleColor}
              zIndex="100"
              bg="transparent"
              _hover={{
                opacity: 1,
                bg: "transparent",
                color: handleHoverColor,
              }}
            />
            {childrenArray[index]}
          </Box>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}
