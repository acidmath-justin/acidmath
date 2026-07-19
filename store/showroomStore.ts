import { create } from "zustand";
import { Product } from "@/lib/types";

type ShowroomState = {
  hoveredProductId: string | null;
  activeProduct: Product | null;
  locked: boolean; // true while mouse-drag look is engaged
  setHovered: (id: string | null) => void;
  setActiveProduct: (product: Product | null) => void;
  setLocked: (locked: boolean) => void;
};

export const useShowroomStore = create<ShowroomState>((set) => ({
  hoveredProductId: null,
  activeProduct: null,
  locked: false,
  setHovered: (id) => set({ hoveredProductId: id }),
  setActiveProduct: (product) => set({ activeProduct: product }),
  setLocked: (locked) => set({ locked }),
}));
