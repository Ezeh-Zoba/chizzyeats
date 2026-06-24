"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
      style={{
        backgroundColor: "var(--ce-overlay-gold)",
        color: "#FFC72C",
        border: "1px solid var(--ce-overlay-gold-border)",
      }}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
