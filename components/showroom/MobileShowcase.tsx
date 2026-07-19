"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useShowroomStore } from "@/store/showroomStore";

export function MobileShowcase({ products }: { products: Product[] }) {
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);

  return (
    <div className="relative h-[100svh] w-full bg-void flex flex-col">
      <div className="absolute inset-0 bg-blotter-wash opacity-60 pointer-events-none" />
      <div className="relative z-10 pt-24 px-5 pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-acidgreen mb-2">
          Showroom · Lite Mode
        </p>
        <h1 className="font-display text-3xl font-700 mb-2">Tap A Piece</h1>
        <p className="font-body text-paper/50 text-sm max-w-sm">
          The full walkable 3D showroom is built for desktop — swipe through
          the current drop below, or view a garment in the Mirror.
        </p>
      </div>

      <div className="relative z-10 flex-1 overflow-x-auto flex gap-4 px-5 pb-8 snap-x snap-mandatory">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveProduct(product)}
            className="snap-center shrink-0 w-[72vw] max-w-xs rounded-2xl overflow-hidden border border-paper/10 bg-void-2 text-left"
          >
            <div className="relative aspect-square">
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="72vw" />
            </div>
            <div className="p-4">
              <p className="font-body text-sm text-paper mb-1">{product.title}</p>
              <p className="font-mono text-xs text-paper/40">${product.price}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
