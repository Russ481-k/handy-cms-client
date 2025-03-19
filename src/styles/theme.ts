import { useColorModeValue } from "@/components/ui/color-mode";
import { COLORS, STYLES } from "./theme-tokens";

export interface Colors {
  bg: string;
  cardBg: string;
  darkBg: string;
  border: string;
  primary: {
    default: string;
    hover: string;
    light: string;
    dark: string;
    alpha: string;
  };
  secondary: {
    default: string;
    hover: string;
    light: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    muted: string;
    accent: string;
  };
  header: {
    bg: string;
    border: string;
    text: string;
    hoverBg: string;
    activeBg: string;
  };
  nav: {
    bg: string;
    border: string;
    text: string;
    hoverText: string;
    hoverBg: string;
  };
  accent: {
    success: {
      default: string;
      bg: string;
      hover: string;
    };
    warning: {
      default: string;
      bg: string;
      hover: string;
    };
    info: {
      default: string;
      bg: string;
      hover: string;
    };
    delete: {
      default: string;
      bg: string;
      hover: string;
    };
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  gradient: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface Styles {
  container: {
    maxW: {
      base: string;
      xl: string;
    };
    px: {
      base: number;
      md: number;
      lg: number;
    };
  };
  section: {
    py: {
      base: number;
      md: number;
      lg: number;
    };
  };
  card: {
    bg: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    boxShadow: string;
    p: number;
    transition: string;
    backdropFilter?: string;
    _hover?: {
      transform?: string;
      boxShadow?: string;
      borderColor?: string;
    };
  };
  header: {
    wrapper: {
      width: string;
      transition: string;
      backdropFilter: string;
      position: "sticky";
      top: number;
      zIndex: number;
      py: number;
    };
    container: {
      maxW: string;
      px: {
        base: number;
        md: number;
        lg: number;
      };
    };
    content: {
      gap: number;
      justify: string;
      align: string;
      width: string;
      height: string;
    };
    logo: {
      minWidth: string;
      height: string;
    };
    nav: {
      display: {
        base: string;
        md: string;
      };
      alignItems: string;
      mt: number;
    };
  };
  nav: {
    item: {
      color: string;
      _hover: {
        color: string;
        bg: string;
      };
    };
  };
  button: {
    primary: {
      bg: string;
      color: string;
      borderRadius: string;
      fontWeight: string;
      px: number;
      py: number;
      transition: string;
      _hover: {
        bg: string;
        transform?: string;
      };
    };
    secondary: {
      bg: string;
      color: string;
      borderRadius: string;
      fontWeight: string;
      px: number;
      py: number;
      transition: string;
      _hover: {
        bg: string;
        transform?: string;
      };
    };
  };
  text: {
    heading: {
      fontWeight: string;
      letterSpacing: string;
      lineHeight: string;
    };
    subheading: {
      fontWeight: string;
      letterSpacing: string;
      lineHeight: string;
    };
    body: {
      letterSpacing: string;
      lineHeight: string;
    };
    gradient?: {
      bgGradient: string;
      bgClip: string;
    };
  };
  badge: {
    fontWeight: string;
    transition: string;
    _hover: {
      transform: string;
    };
  };
  icon: {
    transition: string;
  };
  link: {
    color: string;
    transition: string;
    _hover: {
      color: string;
      textDecoration: string;
    };
  };
  scrollTopButton: {
    position: "fixed";
    bottom: string;
    right: string;
    zIndex: number;
  };
}

export function useColors(): Colors {
  return {
    bg: useColorModeValue(COLORS.light.bg, COLORS.dark.bg),
    cardBg: useColorModeValue(COLORS.light.cardBg, COLORS.dark.cardBg),
    darkBg: COLORS.dark.bg,
    border: useColorModeValue(COLORS.light.border, COLORS.dark.border),
    primary: {
      default: useColorModeValue(
        COLORS.light.primary.default,
        COLORS.dark.primary.default
      ),
      hover: useColorModeValue(
        COLORS.light.primary.hover,
        COLORS.dark.primary.hover
      ),
      light: useColorModeValue(
        COLORS.light.primary.light,
        COLORS.dark.primary.light
      ),
      dark: useColorModeValue(
        COLORS.light.primary.dark,
        COLORS.dark.primary.dark
      ),
      alpha: useColorModeValue(
        COLORS.light.primary.alpha,
        COLORS.dark.primary.alpha
      ),
    },
    secondary: {
      default: useColorModeValue(
        COLORS.light.secondary.default,
        COLORS.dark.secondary.default
      ),
      hover: useColorModeValue(
        COLORS.light.secondary.hover,
        COLORS.dark.secondary.hover
      ),
      light: useColorModeValue(
        COLORS.light.secondary.light,
        COLORS.dark.secondary.light
      ),
      dark: useColorModeValue(
        COLORS.light.secondary.dark,
        COLORS.dark.secondary.dark
      ),
    },
    text: {
      primary: useColorModeValue(
        COLORS.light.text.primary,
        COLORS.dark.text.primary
      ),
      secondary: useColorModeValue(
        COLORS.light.text.secondary,
        COLORS.dark.text.secondary
      ),
      tertiary: useColorModeValue(
        COLORS.light.text.tertiary,
        COLORS.dark.text.tertiary
      ),
      muted: useColorModeValue(COLORS.light.text.muted, COLORS.dark.text.muted),
      inverse: useColorModeValue("white", COLORS.light.text.primary),
      accent: useColorModeValue(
        COLORS.light.primary.hover,
        COLORS.dark.primary.hover
      ),
    },
    header: {
      bg: useColorModeValue(
        "rgba(255, 255, 255, 0.8)",
        "rgba(26, 32, 44, 0.8)"
      ),
      border: useColorModeValue(COLORS.light.border, COLORS.dark.border),
      text: useColorModeValue(
        COLORS.light.text.primary,
        COLORS.dark.text.primary
      ),
      hoverBg: useColorModeValue(
        "rgba(237, 242, 247, 0.8)",
        "rgba(45, 55, 72, 0.8)"
      ),
      activeBg: useColorModeValue(
        "rgba(226, 232, 240, 0.8)",
        "rgba(45, 55, 72, 0.8)"
      ),
    },
    nav: {
      bg: useColorModeValue(COLORS.light.bg, COLORS.dark.bg),
      border: useColorModeValue(COLORS.light.border, COLORS.dark.border),
      text: useColorModeValue(
        COLORS.light.text.primary,
        COLORS.dark.text.primary
      ),
      hoverText: useColorModeValue(
        COLORS.light.primary.hover,
        COLORS.dark.primary.hover
      ),
      hoverBg: useColorModeValue(
        "rgba(237, 242, 247, 0.8)",
        "rgba(45, 55, 72, 0.8)"
      ),
    },
    accent: {
      success: {
        default: useColorModeValue(
          COLORS.light.accent.success.default,
          COLORS.dark.accent.success.default
        ),
        bg: useColorModeValue(
          COLORS.light.accent.success.bg,
          COLORS.dark.accent.success.bg
        ),
        hover: useColorModeValue(
          COLORS.light.accent.success.hover,
          COLORS.dark.accent.success.hover
        ),
      },
      warning: {
        default: useColorModeValue(
          COLORS.light.accent.warning.default,
          COLORS.dark.accent.warning.default
        ),
        bg: useColorModeValue(
          COLORS.light.accent.warning.bg,
          COLORS.dark.accent.warning.bg
        ),
        hover: useColorModeValue(
          COLORS.light.accent.warning.hover,
          COLORS.dark.accent.warning.hover
        ),
      },
      info: {
        default: useColorModeValue(
          COLORS.light.accent.info.default,
          COLORS.dark.accent.info.default
        ),
        bg: useColorModeValue(
          COLORS.light.accent.info.bg,
          COLORS.dark.accent.info.bg
        ),
        hover: useColorModeValue(
          COLORS.light.accent.info.hover,
          COLORS.dark.accent.info.hover
        ),
      },
      delete: {
        default: useColorModeValue(
          COLORS.light.accent.delete.default,
          COLORS.dark.accent.delete.default
        ),
        bg: useColorModeValue(
          COLORS.light.accent.delete.bg,
          COLORS.dark.accent.delete.bg
        ),
        hover: useColorModeValue(
          COLORS.light.accent.delete.hover,
          COLORS.dark.accent.delete.hover
        ),
      },
    },
    shadow: {
      sm: useColorModeValue(COLORS.light.shadow.sm, COLORS.dark.shadow.sm),
      md: useColorModeValue(COLORS.light.shadow.md, COLORS.dark.shadow.md),
      lg: useColorModeValue(COLORS.light.shadow.lg, COLORS.dark.shadow.lg),
    },
    gradient: {
      primary: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      secondary: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      accent: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    },
  } as Colors;
}

export function useStyles(colors: Colors, isScrolled: boolean): Styles {
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
        transform: "translateY(-4px)",
        boxShadow: colors.shadow.lg,
        borderColor: colors.primary.default,
      },
    },
    header: {
      wrapper: {
        width: "100%",
        transition: "all 0.3s ease",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        py: 4,
      },
      container: {
        maxW: "100%",
        px: { base: 2, md: 8, lg: 12 },
      },
      content: {
        gap: 6,
        justify: "space-between",
        align: "flex-start",
        width: "100%",
        height: "100%",
      },
      logo: {
        minWidth: "180px",
        height: "40px",
      },
      nav: {
        display: { base: "none", md: "flex" },
        alignItems: "flex-start",
        mt: 1,
      },
    },
    nav: {
      item: {
        color: colors.nav.text,
        _hover: {
          color: colors.nav.hoverText,
          bg: colors.nav.hoverBg,
        },
      },
    },
    button: {
      primary: {
        ...STYLES.button.primary,
        bg: colors.primary.default,
        color: colors.text.inverse,
        _hover: {
          bg: colors.primary.hover,
          transform: "translateY(-2px)",
        },
      },
      secondary: {
        ...STYLES.button.secondary,
        bg: colors.secondary.default,
        color: colors.text.inverse,
        _hover: {
          bg: colors.secondary.hover,
          transform: "translateY(-2px)",
        },
      },
    },
    text: {
      ...STYLES.text,
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
    },
    badge: STYLES.badge,
    icon: STYLES.icon,
    link: {
      ...STYLES.link,
      color: colors.primary.default,
      _hover: {
        color: colors.primary.hover,
        textDecoration: "none",
      },
    },
    scrollTopButton: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 999,
    },
  } as Styles;
}
