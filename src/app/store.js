import { create } from "zustand";

export const useThemeStore = create((set) => ({
  dark: false,
  toggle: () => set((state) => ({ dark: !state.dark })),
}));