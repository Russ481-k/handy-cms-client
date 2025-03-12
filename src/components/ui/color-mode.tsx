"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ColorMode = "light" | "dark";

interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    // 초기 컬러모드 설정
    const savedMode = localStorage.getItem("color-mode") as ColorMode;
    if (savedMode) {
      setColorMode(savedMode);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(prefersDark ? "dark" : "light");
    }
  }, []);

  const value = {
    colorMode,
    setColorMode: (mode: ColorMode) => {
      setColorMode(mode);
      localStorage.setItem("color-mode", mode);
    },
    toggleColorMode: () => {
      const newMode = colorMode === "light" ? "dark" : "light";
      setColorMode(newMode);
      localStorage.setItem("color-mode", newMode);
    },
  };

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? lightValue : darkValue;
}
