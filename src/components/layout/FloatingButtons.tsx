import { Box, IconButton } from "@chakra-ui/react";
import { LuArrowUp } from "react-icons/lu";
import {} from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { ColorModeToggle } from "../ui/ColorModeToggle";

interface FloatingButtonsProps {
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  showScrollTop,
  scrollToTop,
}) => {
  const colors = useColors();

  return (
    <Box
      position="fixed"
      bottom={{ base: 4, md: 8 }}
      right={{ base: 4, md: 8 }}
      zIndex={10}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <IconButton
        aria-label="맨 위로 이동"
        onClick={scrollToTop}
        bg={colors.cardBg}
        color={colors.primary.default}
        borderWidth="1px"
        borderColor={colors.border}
        boxShadow={colors.shadow.lg}
        borderRadius="full"
        size="lg"
        transform={showScrollTop ? "translateX(0)" : "translateX(100px)"}
        opacity={showScrollTop ? 1 : 0}
        transition="all 0.3s ease-in-out"
        _hover={{
          bg: "rgba(99, 102, 241, 0.1)",
          color: colors.primary.hover,
          transform: showScrollTop ? "translateY(-4px)" : "translateX(100px)",
        }}
      >
        <LuArrowUp />
      </IconButton>
      <ColorModeToggle size="lg" variant="icon" />
    </Box>
  );
};
