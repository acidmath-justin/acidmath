"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { isOpen, close, lines, setQuantity, removeItem, subtotal } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-void-2 border-l border-paper/10 z-[70] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-paper/10">
              <h2 className="font-mono uppercase tracking-widest text-sm text-acidgreen">
                Your Bag ({lines.length})
              </h2>
              <button onClick={close} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {lines.length === 0 && (
                <p className="text-paper/40 font-body text-sm">
                  Nothing in here yet. Tear off a tab in the showroom.
                </p>
              )}
              {lines.map((line) => (
                <div key={line.variantId} className="flex gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-void shrink-0 relative">
                    <Image src={line.image} alt={line.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-paper truncate">{line.title}</p>
                    <p className="font-mono text-xs text-paper/40 mb-2">{line.variantTitle}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(line.variantId, Math.max(1, line.quantity - 1))}
                        className="w-6 h-6 grid place-items-center border border-paper/20 rounded-full hover:border-magenta"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                        className="w-6 h-6 grid place-items-center border border-paper/20 rounded-full hover:border-acidgreen"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(line.variantId)}
                        className="ml-auto text-paper/30 hover:text-magenta"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="font-mono text-sm text-paper/80">
                    ${(line.price * line.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {lines.length > 0 && (
              <div className="px-6 py-6 border-t border-paper/10 space-y-4">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-paper/50">Subtotal</span>
                  <span className="text-paper">${subtotal().toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  disabled={checkingOut}
                  onClick={handleCheckout}
                >
                  {checkingOut ? "Routing to checkout…" : "Checkout"}
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
