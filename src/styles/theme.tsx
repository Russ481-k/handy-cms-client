import { useColorModeValue } from "@/components/ui/color-mode";
import { COLORS, STYLES } from "./theme-tokens";

export const useColors = () => {
  // Color mode values
  return {
    bg: useColorModeValue(COLORS.light.bg, COLORS.dark.bg),
    cardBg: useColorModeValue(COLORS.light.cardBg, COLORS.dark.cardBg),
    darkBg: COLORS.dark.bg,
    border: useColorModeValue(COLORS.light.border, COLORS.dark.border),
    primary: {
      default: useColorModeValue(COLORS.light.primary.default, COLORS.dark.primary.default),
      hover: useColorModeValue(COLORS.light.primary.hover, COLORS.dark.primary.hover),
      light: useColorModeValue(COLORS.light.primary.light, COLORS.dark.primary.light),
      dark: useColorModeValue(COLORS.light.primary.dark, COLORS.dark.primary.dark),
      alpha: useColorModeValue(COLORS.light.primary.alpha, COLORS.dark.primary.alpha),
    },
    secondary: {
      default: useColorModeValue(COLORS.light.secondary.default, COLORS.dark.secondary.default),
      hover: useColorModeValue(COLORS.light.secondary.hover, COLORS.dark.secondary.hover),
      light: useColorModeValue(COLORS.light.secondary.light, COLORS.dark.secondary.light),
      dark: useColorModeValue(COLORS.light.secondary.dark, COLORS.dark.secondary.dark),
    },
    text: {
      primary: useColorModeValue(COLORS.light.text.primary, COLORS.dark.text.primary),
      secondary: useColorModeValue(COLORS.light.text.secondary, COLORS.dark.text.secondary),
      inverse: useColorModeValue("white", COLORS.light.text.primary),
      muted: useColorModeValue(COLORS.light.text.muted, COLORS.dark.text.muted),
      accent: useColorModeValue(COLORS.light.primary.hover, COLORS.dark.primary.hover),
    },
    accent: {
      success: {
        default: useColorModeValue(COLORS.light.accent.success.default, COLORS.dark.accent.success.default),
        bg: useColorModeValue(COLORS.light.accent.success.bg, COLORS.dark.accent.success.bg),
        hover: useColorModeValue(COLORS.light.accent.success.hover, COLORS.dark.accent.success.hover),
      },
      warning: {
        default: useColorModeValue(COLORS.light.accent.warning.default, COLORS.dark.accent.warning.default),
        bg: useColorModeValue(COLORS.light.accent.warning.bg, COLORS.dark.accent.warning.bg),
        hover: useColorModeValue(COLORS.light.accent.warning.hover, COLORS.dark.accent.warning.hover),
      },
      info: {
        default: useColorModeValue(COLORS.light.accent.info.default, COLORS.dark.accent.info.default),
        bg: useColorModeValue(COLORS.light.accent.info.bg, COLORS.dark.accent.info.bg),
        hover: useColorModeValue(COLORS.light.accent.info.hover, COLORS.dark.accent.info.hover),
      },
    },
    hover: {
      card: useColorModeValue(COLORS.light.secondary.light, COLORS.dark.secondary.light),
      link: useColorModeValue(COLORS.light.primary.hover, COLORS.dark.primary.hover),
    },
    shadow: {
      sm: useColorModeValue(COLORS.light.shadow.sm, COLORS.dark.shadow.sm),
      md: useColorModeValue(COLORS.light.shadow.md, COLORS.dark.shadow.md),
      lg: useColorModeValue(COLORS.light.shadow.lg, COLORS.dark.shadow.lg),
    },
    dialog: {
      overlay: {
        bg: useColorModeValue("rgba(15, 23, 42, 0.6)", "rgba(0, 0, 0, 0.8)"),
        backdropFilter: "blur(12px)",
      },
    },
    gradient: {
      primary: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      secondary: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      accent: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    }
  };
};

export const useStyles = (colors: ReturnType<typeof useColors>, showScrollTop: boolean) => {
  return {
    container: STYLES.container,
    section: STYLES.section,
    card: {
      ...STYLES.card,
      bg: colors.cardBg,
      borderColor: colors.border,
      borderWidth: "1px",
      boxShadow: colors.shadow.sm,
      backdropFilter: "blur(12px)",
      _hover: {
        ...STYLES.card._hover,
        boxShadow: colors.shadow.lg,
        borderColor: colors.primary.default,
      },
    },
    infoCard: {
      bg: colors.primary.light,
      borderRadius: "2xl",
      p: 8,
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(12px)",
      _hover: {
        transform: "translateY(-4px)",
        boxShadow: colors.shadow.md,
      },
    },
    button: {
      primary: {
        ...STYLES.button.primary,
        bgGradient: colors.gradient.primary,
        color: colors.text.inverse,
        _hover: { 
          ...STYLES.button.primary._hover,
          bgGradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: colors.shadow.md,
        },
        _active: {
          bgGradient: "linear-gradient(135deg, #3730a3, #6d28d9)",
          transform: "translateY(0)",
        },
      },
      secondary: {
        ...STYLES.button.secondary,
        bg: "rgba(99, 102, 241, 0.1)",
        color: colors.primary.default,
        borderColor: "transparent",
        _hover: { 
          ...STYLES.button.secondary._hover,
          bg: "rgba(99, 102, 241, 0.15)",
          borderColor: colors.primary.default,
          boxShadow: colors.shadow.sm,
        },
        _active: {
          bg: "rgba(99, 102, 241, 0.2)",
          transform: "translateY(0)",
        },
      },
      outline: {
        ...STYLES.button.secondary,
        bg: "transparent",
        color: colors.primary.default,
        borderColor: colors.primary.default,
        _hover: {
          ...STYLES.button.secondary._hover,
          bg: "rgba(99, 102, 241, 0.1)",
          boxShadow: colors.shadow.sm,
        },
        _active: {
          bg: "rgba(99, 102, 241, 0.15)",
          transform: "translateY(0)",
        },
      },
    },
    text: {
      heading: {
        ...STYLES.text.heading,
        color: colors.text.primary,
      },
      subheading: {
        ...STYLES.text.subheading,
        color: colors.text.secondary,
      },
      body: {
        ...STYLES.text.body,
        color: colors.text.secondary,
      },
      gradient: {
        ...STYLES.text.heading,
        bgGradient: colors.gradient.primary,
        bgClip: "text",
      },
    },
    badge: {
      success: {
        ...STYLES.badge,
        bg: colors.accent.success.bg,
        color: colors.accent.success.default,
        px: 6,
        py: 2,
        borderRadius: "full",
        fontWeight: "bold",
        fontSize: "md",
        letterSpacing: "wide",
        borderWidth: "1px",
        borderColor: "transparent",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease-in-out",
        _hover: {
          ...STYLES.badge._hover,
          borderColor: colors.accent.success.default,
          transform: "translateY(-1px)",
        },
      },
      info: {
        ...STYLES.badge,
        bg: colors.accent.info.bg,
        color: colors.accent.info.default,
        px: 6,
        py: 2,
        borderRadius: "full",
        fontWeight: "bold",
        fontSize: "md",
        letterSpacing: "wide",
        borderWidth: "1px",
        borderColor: "transparent",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease-in-out",
        _hover: {
          ...STYLES.badge._hover,
          borderColor: colors.accent.info.default,
          transform: "translateY(-1px)",
        },
      },
      warning: {
        ...STYLES.badge,
        bg: colors.accent.warning.bg,
        color: colors.accent.warning.default,
        px: 6,
        py: 2,
        borderRadius: "full",
        fontWeight: "bold",
        fontSize: "md",
        letterSpacing: "wide",
        borderWidth: "1px",
        borderColor: "transparent",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease-in-out",
        _hover: {
          ...STYLES.badge._hover,
          borderColor: colors.accent.warning.default,
          transform: "translateY(-1px)",
        },
      },
    },
    icon: {
      primary: {
        ...STYLES.icon,
        color: colors.primary.default,
        boxSize: { base: 6, md: 7 },
        transition: "all 0.3s ease-in-out",
        _groupHover: {
          transform: "scale(1.2) rotate(10deg)",
          color: colors.primary.hover,
        },
      },
      secondary: {
        ...STYLES.icon,
        color: colors.text.secondary,
        boxSize: { base: 5, md: 6 },
        transition: "all 0.3s ease-in-out",
        _groupHover: {
          color: colors.text.primary,
          transform: "scale(1.1)",
        },
      },
      accent: {
        ...STYLES.icon,
        color: colors.text.accent,
        boxSize: { base: 6, md: 7 },
        _groupHover: {
          transform: "scale(1.2) rotate(10deg)",
        },
      },
    },
    link: {
      default: {
        ...STYLES.link,
        color: colors.text.secondary,
        _hover: {
          ...STYLES.link._hover,
          color: colors.hover.link,
        },
      },
      accent: {
        ...STYLES.link,
        color: colors.primary.default,
        _hover: {
          ...STYLES.link._hover,
          color: colors.primary.hover,
        },
      },
    },
    dialog: {
      overlay: {
        bg: useColorModeValue("blackAlpha.600", "blackAlpha.800"),
        backdropFilter: "blur(8px)",
      },
      content: {
        bg: colors.cardBg,
        borderColor: colors.border,
        borderRadius: "3xl",
        boxShadow: colors.shadow.lg,
        p: 8,
      },
    },
    floatingButton: {
      position: "fixed",
      bottom: { base: 6, md: 10 },
      right: { base: 6, md: 10 },
      zIndex: 10,
      bg: colors.cardBg,
      color: colors.primary.default,
      borderWidth: "1px",
      borderColor: colors.border,
      borderRadius: "2xl",
      boxShadow: colors.shadow.lg,
      backdropFilter: "blur(8px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        bg: colors.primary.light,
        color: colors.primary.hover,
        transform: "translateY(-4px)",
      },
    },
    scrollTopButton: {
      position: "fixed",
      bottom: { base: 24, md: 28 },
      right: { base: 6, md: 10 },
      zIndex: 10,
      bg: colors.cardBg,
      color: colors.primary.default,
      borderWidth: "1px",
      borderColor: colors.border,
      borderRadius: "2xl",
      boxShadow: colors.shadow.lg,
      backdropFilter: "blur(8px)",
      transform: showScrollTop ? "translateX(0)" : "translateX(100px)",
      opacity: showScrollTop ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        bg: colors.primary.light,
        color: colors.primary.hover,
        transform: showScrollTop ? "translateX(0) translateY(-4px)" : "translateX(100px)",
      },
    },
  };
}; 