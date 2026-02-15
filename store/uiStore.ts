import { create } from "zustand";

type Mode = "light" | "dark" | "system";
type Style = "apple" | "startup" | "colorful" | "tech";

type UIState = {
  mode: Mode;
  style: Style;
  setMode: (mode: Mode) => void;
  setStyle: (style: Style) => void;
};

export const useUIStore = create<UIState>((set) => ({
  mode: "system",
  style: "apple",

  setMode: (mode) => {
    localStorage.setItem("ui-mode", mode);
    set({ mode });
  },

  setStyle: (style) => {
    localStorage.setItem("ui-style", style);
    set({ style });
  },
}));
