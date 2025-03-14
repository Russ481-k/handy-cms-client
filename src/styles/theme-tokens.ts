// 공통 색상 상수 정의
export const COLORS = {
  // 기본 색상
  light: {
    bg: "#f8fafc",
    cardBg: "white",
    border: "#e2e8f0",
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#64748b",
    },
    primary: {
      default: "#6366f1",
      hover: "#4f46e5",
      light: "#eef2ff",
      dark: "#3730a3",
      alpha: "rgba(99, 102, 241, 0.1)",
    },
    secondary: {
      default: "#64748b",
      hover: "#475569",
      light: "#f1f5f9",
      dark: "#334155",
    },
    accent: {
      success: {
        default: "#10b981",
        bg: "#ecfdf5",
        hover: "#059669",
      },
      warning: {
        default: "#f59e0b",
        bg: "#fffbeb",
        hover: "#d97706",
      },
      info: {
        default: "#0ea5e9",
        bg: "#f0f9ff",
        hover: "#0284c7",
      },
    },
    shadow: {
      sm: "0 2px 8px rgba(15, 23, 42, 0.08)",
      md: "0 4px 12px rgba(15, 23, 42, 0.08)",
      lg: "0 8px 24px rgba(15, 23, 42, 0.08)",
    },
  },
  dark: {
    bg: "#0f172a",
    cardBg: "#1e293bff",
    border: "#3341556c",
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      muted: "#94a3b8",
    },
    primary: {
      default: "#818cf8",
      hover: "#a5b4fc",
      light: "#1e1b4b",
      dark: "#c7d2fe",
      alpha: "rgba(129, 140, 248, 0.1)",
    },
    secondary: {
      default: "#94a3b8",
      hover: "#cbd5e1",
      light: "#1e293b",
      dark: "#e2e8f0",
    },
    accent: {
      success: {
        default: "#34d399",
        bg: "#064e3b",
        hover: "#6ee7b7",
      },
      warning: {
        default: "#fbbf24",
        bg: "#78350f",
        hover: "#fcd34d",
      },
      info: {
        default: "#38bdf8",
        bg: "#0c4a6e",
        hover: "#7dd3fc",
      },
    },
    shadow: {
      sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
      md: "0 4px 12px rgba(0, 0, 0, 0.3)",
      lg: "0 8px 24px rgba(0, 0, 0, 0.3)",
    },
  },
};

// 공통 스타일 상수
export const STYLES = {
  container: {
    maxW: { base: "container.lg", xl: "container.xl" },
    px: { base: 6, md: 8, lg: 12 },
  },
  section: {
    py: { base: 20, md: 24, lg: 32 },
  },
  card: {
    borderRadius: "3xl",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    _hover: {
      transform: "translateY(-4px)",
    },
  },
  button: {
    primary: {
      fontWeight: "bold",
      px: 8,
      py: 6,
      borderRadius: "2xl",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        transform: "translateY(-2px)",
      },
    },
    secondary: {
      fontWeight: "bold",
      px: 8,
      py: 6,
      borderRadius: "2xl",
      borderWidth: "1px",
      backdropFilter: "blur(12px)",
      _hover: {
        transform: "translateY(-2px)",
      },
    },
  },
  text: {
    heading: {
      letterSpacing: "tight",
      lineHeight: "shorter",
      fontWeight: "black",
    },
    subheading: {
      letterSpacing: "wide",
      fontWeight: "semibold",
      textTransform: "uppercase",
    },
    body: {
      lineHeight: "tall",
      fontSize: { base: "lg", md: "xl" },
    },
  },
  badge: {
    px: 6,
    py: 2,
    borderRadius: "full",
    fontWeight: "bold",
    fontSize: "md",
    letterSpacing: "wide",
    borderWidth: "1px",
    backdropFilter: "blur(12px)",
    _hover: {
      transform: "translateY(-1px)",
    },
  },
  icon: {
    transition: "all 0.3s ease-in-out",
  },
  link: {
    transition: "all 0.3s ease-in-out",
    _hover: {
      textDecoration: "none",
      transform: "translateY(-1px)",
    },
  },
};
