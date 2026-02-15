"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, style, setMode, setStyle } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    // 🔥 Charger depuis localStorage au premier mount
    const storedMode = localStorage.getItem("ui-mode");
    const storedStyle = localStorage.getItem("ui-style");

    if (storedMode) setMode(storedMode as any);
    if (storedStyle) setStyle(storedStyle as any);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // MODE
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.classList.toggle("dark", prefersDark);
    }

    // STYLE
    root.setAttribute("data-style", style);
  }, [mode, style]);

  return <>{children}</>;
}
