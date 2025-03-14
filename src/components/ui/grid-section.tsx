"use client";

import { Box, Button } from "@chakra-ui/react";
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
    isStatic?: boolean;
    isHeader?: boolean;
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
  const isDark = colorMode === "dark";

  // 테마 색상 적용
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.5)",
    "rgba(26, 32, 44, 0.4)"
  );
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.4)",
    "rgba(74, 85, 104, 0.2)"
  );
  const handleColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );
  const handleHoverColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );
  const placeholderBg = useColorModeValue(
    "rgba(99, 102, 241, 0.1)",
    "rgba(129, 140, 248, 0.1)"
  );
  const hoverBorderColor = useColorModeValue(
    "rgba(99, 102, 241, 0.3)",
    "rgba(129, 140, 248, 0.3)"
  );
  const hoverBg = useColorModeValue(
    "rgba(241, 245, 249, 0.6)",
    "rgba(30, 41, 59, 0.6)"
  );

  const childrenArray = React.Children.toArray(children);

  const [layouts, setLayouts] = useState<Layouts>({
    lg: initialLayout.map(({ id, x, y, w, h, isStatic = false }) => ({
      i: id,
      x,
      y,
      w,
      h,
      static: isStatic || id === "header",
    })),
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
            color: ${isDark ? colors.text.secondary : colors.text.secondary};
            transition: all 0.3s ease;
            &:hover {
              opacity: 1;
              color: ${isDark
                ? colors.primary.default
                : colors.primary.default};
            }
          }
          .react-grid-item.react-grid-placeholder {
            background: ${placeholderBg};
            opacity: 0.3;
            border-radius: 1rem;
            border: 1px dashed ${colors.primary.alpha};
            transition: all 200ms ease;
          }
          .react-grid-item.react-draggable-dragging {
            transition: none;
            z-index: 100;
            cursor: move;
            box-shadow: ${colors.shadow.md};
            border-color: ${colors.primary.alpha};
            background: ${isDark
              ? "rgba(30, 41, 59, 0.7)"
              : "rgba(241, 245, 249, 0.7)"};
            backdrop-filter: blur(12px);
          }
          .react-grid-item.static {
            cursor: default;
          }
        `}
      />
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={
          initialLayout.some((item) => item.id === "header" && item.isHeader)
            ? 60
            : 100
        }
        onLayoutChange={onLayoutChange}
        isDraggable
        isResizable
        margin={[16, 16]}
        draggableHandle=".drag-handle"
      >
        {initialLayout.map((layout, index) => {
          const isHeaderSection = layout.id === "header" || layout.isHeader;
          const isStatic = layout.isStatic || isHeaderSection;

          return (
            <Box
              key={layout.id}
              bg={bgColor}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              p="3"
              shadow={colors.shadow.sm}
              transition="all 0.3s ease-in-out"
              _hover={{
                shadow: isStatic ? colors.shadow.sm : colors.shadow.md,
                borderColor: isStatic ? borderColor : hoverBorderColor,
                bg: isStatic ? bgColor : hoverBg,
                transform: isStatic ? "none" : "translateY(-2px)",
              }}
              position="relative"
              backdropFilter="blur(8px)"
              overflow="hidden"
              className={isStatic ? "static-section" : ""}
            >
              {!isStatic && (
                <Button
                  className="drag-handle"
                  aria-label="Move section"
                  size="sm"
                  variant="ghost"
                  position="absolute"
                  top="2"
                  right="2"
                  opacity="0.4"
                  cursor="move"
                  color={handleColor}
                  zIndex="100"
                  bg="transparent"
                  minW="auto"
                  h="auto"
                  p="1"
                  _hover={{
                    opacity: 1,
                    bg: "transparent",
                    color: handleHoverColor,
                    transform: "scale(1.1)",
                  }}
                  _active={{
                    transform: "scale(0.95)",
                  }}
                >
                  <LuGrip size={16} />
                </Button>
              )}
              {childrenArray[index]}
            </Box>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
}
