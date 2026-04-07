"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        cursor: "pointer",
        color: isDark ? "#F1F5F9" : "#0F172A",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="theme-toggle-btn"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun size={20} className="animate-scale-in" />
      ) : (
        <Moon size={20} className="animate-scale-in" />
      )}
      <style jsx>{`
        .theme-toggle-btn:hover {
          transform: scale(1.1);
          background: ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
        }
        .theme-toggle-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </button>
  );
}
