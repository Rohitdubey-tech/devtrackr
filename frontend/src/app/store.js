import { create } from "zustand";

// Read initial theme: localStorage > system preference > default light
const getInitialTheme = () => {
  const stored = localStorage.getItem("devtrackr-theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  // Fall back to system preference
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const useThemeStore = create((set) => ({
  dark: getInitialTheme(),
  toggle: () =>
    set((state) => {
      const next = !state.dark;
      localStorage.setItem("devtrackr-theme", next ? "dark" : "light");
      return { dark: next };
    }),
  setDark: (value) => {
    localStorage.setItem("devtrackr-theme", value ? "dark" : "light");
    return set({ dark: value });
  },
}));