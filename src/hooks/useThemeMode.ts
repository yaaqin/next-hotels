'use client'

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

// Tema terang/gelap: disimpan di localStorage "theme", diterapkan lewat class .dark di <html>
export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode) ?? "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return { theme, isDark: theme === "dark", toggleTheme };
}
