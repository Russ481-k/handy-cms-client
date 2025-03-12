import { useColorModeValue } from "@/components/ui/color-mode";

export const useColors = () => {
  // Color mode values
  return {
    bg: useColorModeValue("#f8fafc", "#0f172a"),
    cardBg: useColorModeValue("white", "#1e293b"),
    darkBg: "#0f172a",
    border: useColorModeValue("#e2e8f0", "#334155"),
    primary: {
      default: useColorModeValue("#6366f1", "#818cf8"),
      hover: useColorModeValue("#4f46e5", "#a5b4fc"),
      light: useColorModeValue("#eef2ff", "#1e1b4b"),
      dark: useColorModeValue("#3730a3", "#c7d2fe"),
      alpha: useColorModeValue("rgba(99, 102, 241, 0.1)", "rgba(129, 140, 248, 0.1)"),
    },
    secondary: {
      default: useColorModeValue("#64748b", "#94a3b8"),
      hover: useColorModeValue("#475569", "#cbd5e1"),
      light: useColorModeValue("#f1f5f9", "#1e293b"),
      dark: useColorModeValue("#334155", "#e2e8f0"),
    },
    text: {
      primary: useColorModeValue("#0f172a", "#f8fafc"),
      secondary: useColorModeValue("#475569", "#cbd5e1"),
      inverse: useColorModeValue("white", "#0f172a"),
      muted: useColorModeValue("#64748b", "#94a3b8"),
      accent: useColorModeValue("#4f46e5", "#a5b4fc"),
    },
    accent: {
      success: {
        default: useColorModeValue("#10b981", "#34d399"),
        bg: useColorModeValue("#ecfdf5", "#064e3b"),
        hover: useColorModeValue("#059669", "#6ee7b7"),
      },
      warning: {
        default: useColorModeValue("#f59e0b", "#fbbf24"),
        bg: useColorModeValue("#fffbeb", "#78350f"),
        hover: useColorModeValue("#d97706", "#fcd34d"),
      },
      info: {
        default: useColorModeValue("#0ea5e9", "#38bdf8"),
        bg: useColorModeValue("#f0f9ff", "#0c4a6e"),
        hover: useColorModeValue("#0284c7", "#7dd3fc"),
      },
    },
    hover: {
      card: useColorModeValue("#f1f5f9", "#1e293b"),
      link: useColorModeValue("#4f46e5", "#a5b4fc"),
    },
    shadow: {
      sm: useColorModeValue(
        "0 2px 8px rgba(15, 23, 42, 0.08)",
        "0 2px 8px rgba(0, 0, 0, 0.3)"
      ),
      md: useColorModeValue(
        "0 4px 12px rgba(15, 23, 42, 0.08)",
        "0 4px 12px rgba(0, 0, 0, 0.3)"
      ),
      lg: useColorModeValue(
        "0 8px 24px rgba(15, 23, 42, 0.08)",
        "0 8px 24px rgba(0, 0, 0, 0.3)"
      ),
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
    container: {
      maxW: { base: "container.lg", xl: "container.xl" },
      px: { base: 6, md: 8, lg: 12 },
    },
    section: {
      py: { base: 20, md: 24, lg: 32 },
    },
    card: {
      bg: colors.cardBg,
      borderColor: colors.border,
      borderWidth: "1px",
      borderRadius: "3xl",
      boxShadow: colors.shadow.sm,
      backdropFilter: "blur(12px)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        boxShadow: colors.shadow.lg,
        borderColor: colors.primary.default,
        transform: "translateY(-4px)",
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
        bgGradient: colors.gradient.primary,
        color: colors.text.inverse,
        fontWeight: "bold",
        px: 8,
        py: 6,
        borderRadius: "2xl",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: { 
          bgGradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          transform: "translateY(-2px)",
          boxShadow: colors.shadow.md,
        },
        _active: {
          bgGradient: "linear-gradient(135deg, #3730a3, #6d28d9)",
          transform: "translateY(0)",
        },
      },
      secondary: {
        bg: "rgba(99, 102, 241, 0.1)",
        color: colors.primary.default,
        fontWeight: "bold",
        px: 8,
        py: 6,
        borderRadius: "2xl",
        borderWidth: "1px",
        borderColor: "transparent",
        backdropFilter: "blur(12px)",
        _hover: { 
          bg: "rgba(99, 102, 241, 0.15)",
          borderColor: colors.primary.default,
          transform: "translateY(-2px)",
          boxShadow: colors.shadow.sm,
        },
        _active: {
          bg: "rgba(99, 102, 241, 0.2)",
          transform: "translateY(0)",
        },
      },
      outline: {
        bg: "transparent",
        color: colors.primary.default,
        borderColor: colors.primary.default,
        borderWidth: "1px",
        borderRadius: "2xl",
        fontWeight: "bold",
        px: 8,
        py: 6,
        backdropFilter: "blur(12px)",
        _hover: {
          bg: "rgba(99, 102, 241, 0.1)",
          transform: "translateY(-2px)",
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
        color: colors.text.primary,
        letterSpacing: "tight",
        lineHeight: "shorter",
        fontWeight: "black",
      },
      subheading: {
        color: colors.text.secondary,
        letterSpacing: "wide",
        fontWeight: "semibold",
        textTransform: "uppercase",
      },
      body: {
        color: colors.text.secondary,
        lineHeight: "tall",
        fontSize: { base: "lg", md: "xl" },
      },
      gradient: {
        bgGradient: colors.gradient.primary,
        bgClip: "text",
        letterSpacing: "tight",
        lineHeight: "shorter",
        fontWeight: "black",
      },
    },
    badge: {
      success: {
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
        _hover: {
          borderColor: colors.accent.success.default,
          transform: "translateY(-1px)",
        },
      },
      info: {
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
        _hover: {
          borderColor: colors.accent.info.default,
          transform: "translateY(-1px)",
        },
      },
      warning: {
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
        _hover: {
          borderColor: colors.accent.warning.default,
          transform: "translateY(-1px)",
        },
      },
    },
    icon: {
      primary: {
        color: colors.primary.default,
        boxSize: { base: 6, md: 7 },
        transition: "all 0.3s ease-in-out",
        _groupHover: {
          transform: "scale(1.2) rotate(10deg)",
          color: colors.primary.hover,
        },
      },
      secondary: {
        color: colors.text.secondary,
        boxSize: { base: 5, md: 6 },
        transition: "all 0.3s ease-in-out",
        _groupHover: {
          color: colors.text.primary,
          transform: "scale(1.1)",
        },
      },
      accent: {
        color: colors.text.accent,
        boxSize: { base: 6, md: 7 },
        transition: "all 0.3s ease-in-out",
        _groupHover: {
          transform: "scale(1.2) rotate(10deg)",
        },
      },
    },
    link: {
      default: {
        color: colors.text.secondary,
        transition: "all 0.3s ease-in-out",
        _hover: {
          color: colors.hover.link,
          textDecoration: "none",
          transform: "translateY(-1px)",
        },
      },
      accent: {
        color: colors.primary.default,
        transition: "all 0.3s ease-in-out",
        _hover: {
          color: colors.primary.hover,
          textDecoration: "none",
          transform: "translateY(-1px)",
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