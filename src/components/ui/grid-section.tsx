"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import { LuGrip } from "react-icons/lu";
import * as React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import { css, Global } from "@emotion/react";

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
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "transparent");

  const childrenArray = React.Children.toArray(children);

  const [layouts, setLayouts] = useState<Layouts>({
    lg: initialLayout.map(({ id, x, y, w, h }) => ({ i: id, x, y, w, h })),
  });

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <Box>
      <Global
        styles={css`
          .react-resizable-handle {
            opacity: 0.3;
            color: #718096;
            &:hover {
              opacity: 1;
              color: #4a5568;
            }
          }
          .react-grid-item.react-grid-placeholder {
            background: #a0aec0; // gray.400
            opacity: 0.2;
            border-radius: 0.375rem;
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
        margin={[8, 8]}
        draggableHandle=".drag-handle"
      >
        {initialLayout.map((layout, index) => (
          <Box
            key={layout.id}
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            p="2"
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: "md" }}
            position="relative"
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
              color="gray.500"
              zIndex="100"
              bg="transparent"
              _hover={{
                opacity: 1,
                bg: "transparent",
                color: "gray.700",
              }}
            />
            {childrenArray[index]}
          </Box>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}
