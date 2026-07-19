"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { BlotterTab } from "@/components/ui/BlotterTab";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const [added, setAdded] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8 pt-32 pb-24">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-acidgreen mb-8"
      >
        <ArrowLeft size={14} /> All collections
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-void-2 border border-paper/10">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-acidgreen bg-void/70 px-2 py-1 rounded">
            Batch {product.batchCode}
          </span>
        </div>

        <div className="flex flex-col">
          <p className="font-mono text-xs uppercase tracking-widest text-magenta mb-2">
            {product.category.replace("-", " ")}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-4">{product.title}</h1>
          <p className="font-body text-paper/60 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-mono text-2xl text-paper">${product.price}</span>
            {product.compareAtPrice && (
              <span className="font-mono text-base text-paper/30 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40 mb-3">
            Tear off a size
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {product.variants.map((variant) => (
              <BlotterTab
                key={variant.id}
                label={variant.size ?? variant.title.slice(0, 2).toUpperCase()}
                active={selectedVariantId === variant.id}
                disabled={!variant.available}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setAdded(false);
                }}
              />
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button
              disabled={!selectedVariant}
              onClick={() => {
                if (!selectedVariant) return;
                addItem(product, selectedVariant);
                setAdded(true);
              }}
            >
              {added ? "Added to Bag" : selectedVariant ? "Add To Bag" : "Select A Size"}
            </Button>
            <Link
              href="/mirror"
              className="text-center font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-acidgreen underline underline-offset-4"
            >
              Try it on in the Mirror →
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-6">
            More from this drop
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
