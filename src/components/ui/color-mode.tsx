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
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 초기 컬러모드 설정
    const savedMode = localStorage.getItem("color-mode") as ColorMode;
    if (savedMode) {
      setColorMode(savedMode);
    } else {
      // 기본값을 다크 모드로 설정
      setColorMode("dark");
      localStorage.setItem("color-mode", "dark");
    }
    setMounted(true);
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

  // 마운트되기 전에는 children을 렌더링하지 않음
  if (!mounted) {
    return null;
  }

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
