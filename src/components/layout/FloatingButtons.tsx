import { Box, IconButton } from "@chakra-ui/react";
import { LuArrowUp, LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";
import { useColors, useStyles } from "@/styles/theme";

interface FloatingButtonsProps {
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ showScrollTop, scrollToTop }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colors = useColors();
  const styles = useStyles(colors, showScrollTop);

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
      <IconButton
        aria-label={colorMode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        onClick={toggleColorMode}
        bg={colors.cardBg}
        color={colorMode === 'light' ? "#8b5cf6" : "#fbbf24"}
        borderWidth="1px"
        borderColor={colors.border}
        boxShadow={colors.shadow.lg}
        borderRadius="full"
        size="lg"
        _hover={{
          bg: colorMode === 'light' ? "rgba(139, 92, 246, 0.1)" : "rgba(251, 191, 36, 0.1)",
          transform: "translateY(-4px)",
        }}
        transition="all 0.3s ease-in-out"
      >
        {colorMode === 'light' ? <LuMoon /> : <LuSun />}
      </IconButton>
    </Box>
  );
};