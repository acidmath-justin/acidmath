"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useShowroomStore } from "@/store/showroomStore";

export function ProductCard({ product }: { product: Product }) {
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);

  return (
    <Link
      href={`/collections/${product.handle}`}
      className="group block text-left rounded-2xl overflow-hidden border border-paper/10 bg-void-2 hover:border-magenta/60 transition-colors"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-acidgreen bg-void/70 px-2 py-1 rounded">
          {product.batchCode}
        </span>
        {!product.variants.some((v) => v.available) && (
          <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-paper/70 bg-void/80 px-2 py-1 rounded">
            Sold Out
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveProduct(product);
          }}
          className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-paper/70 bg-void/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-acidgreen"
        >
          Quick view
        </button>
      </div>
      <div className="p-4">
        <p className="font-body text-sm text-paper mb-1">{product.title}</p>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-paper/80">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-paper/30 line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
