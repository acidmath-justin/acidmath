import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine, Product, ProductVariant } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        const existing = get().lines.find((l) => l.variantId === variant.id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.variantId === variant.id ? { ...l, quantity: l.quantity + quantity } : l
            ),
          });
        } else {
          set({
            lines: [
              ...get().lines,
              {
                variantId: variant.id,
                productId: product.id,
                title: product.title,
                variantTitle: variant.title,
                price: variant.price,
                quantity,
                image: product.images[0],
              },
            ],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (variantId) => set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),

      setQuantity: (variantId, quantity) =>
        set({
          lines: get().lines.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
        }),

      clear: () => set({ lines: [] }),

      totalQuantity: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "acidmath-cart" }
  )
);
