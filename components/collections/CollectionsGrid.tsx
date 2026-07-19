"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "@/components/showroom/ProductModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import clsx from "clsx";

const CATEGORIES: { value: Product["category"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hoodie", label: "Hoodies" },
  { value: "tee", label: "Tees" },
  { value: "long-sleeve", label: "Long Sleeve" },
  { value: "jacket", label: "Jackets" },
  { value: "accessory", label: "Accessories" },
];

export function CollectionsGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["value"]>("all");

  const filtered = useMemo(
    () => (category === "all" ? products : products.filter((p) => p.category === category)),
    [products, category]
  );

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 pt-32 pb-24">
      <SectionHeading
        eyebrow="AM-024 · Current Drop"
        title="Collections"
        description="Every piece starts as a real blotter sheet, scanned and enlarged 40x before it ever touches fabric."
        className="mb-10"
      />

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={clsx(
              "font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors",
              category === c.value
                ? "border-magenta text-magenta shadow-neon"
                : "border-paper/20 text-paper/50 hover:border-paper/50"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <ProductModal />
    </div>
  );
}
