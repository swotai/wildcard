import { useEffect, useState } from "react";

const STORAGE_KEY = "wildcard-theme";

export type ThemeMode = "auto" | "light" | "dark";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  return "auto";
}

/**
 * Three-state theme:
 *  - "auto"  follows the OS `prefers-color-scheme` *live*
 *  - "light" / "dark" are explicit and win over the system
 * The choice persists in localStorage.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  // Keep the OS preference up to date so "auto" reacts instantly when it flips.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const dark = mode === "dark" || (mode === "auto" && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const cycle = () =>
    setMode((m) => (m === "auto" ? "light" : m === "light" ? "dark" : "auto"));

  return { mode, dark, setMode, cycle };
}
