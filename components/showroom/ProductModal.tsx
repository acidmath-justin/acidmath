"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useShowroomStore } from "@/store/showroomStore";
import { useCartStore } from "@/store/cartStore";
import { BlotterTab } from "@/components/ui/BlotterTab";
import { Button } from "@/components/ui/Button";

export function ProductModal() {
  const product = useShowroomStore((s) => s.activeProduct);
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  function close() {
    setActiveProduct(null);
    setSelectedVariantId(null);
  }

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] bg-void/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-void-2 border border-paper/10 rounded-2xl grid md:grid-cols-2 gap-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 text-paper/60 hover:text-paper bg-void/60 rounded-full p-2"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-square bg-void">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-acidgreen bg-void/70 px-2 py-1 rounded">
                Batch {product.batchCode}
              </span>
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-magenta mb-2">
                {product.category.replace("-", " ")}
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-700 mb-3">{product.title}</h3>
              <p className="font-body text-paper/60 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-mono text-xl text-paper">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="font-mono text-sm text-paper/30 line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40 mb-3">
                Tear off a size
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {product.variants.map((variant) => (
                  <BlotterTab
                    key={variant.id}
                    label={variant.size ?? variant.title.slice(0, 2).toUpperCase()}
                    active={selectedVariantId === variant.id}
                    disabled={!variant.available}
                    onClick={() => setSelectedVariantId(variant.id)}
                  />
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Button
                  disabled={!selectedVariant}
                  onClick={() => {
                    if (!selectedVariant) return;
                    addItem(product, selectedVariant);
                    close();
                  }}
                >
                  {selectedVariant ? "Add To Bag" : "Select A Size"}
                </Button>
                <a href="/mirror" className="text-center font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-acidgreen underline underline-offset-4">
                  Try it on in the Mirror →
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
