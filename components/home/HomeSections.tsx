"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { SectionHeading, GlowText } from "@/components/ui/SectionHeading";
import { PerforatedDivider } from "@/components/ui/BlotterTab";
import { ProductCard } from "@/components/collections/ProductCard";
import { ProductModal } from "@/components/showroom/ProductModal";

const GALLERY_PREVIEW = [
  "https://placehold.co/500x625/1a0a2e/F4F1E8?text=Campaign+01",
  "https://placehold.co/500x625/0a0a14/FF2E9A?text=Campaign+02",
  "https://placehold.co/500x625/111120/39FF6A?text=Campaign+03",
];

function ShowroomTeaser() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-blotter-wash opacity-70" />
      <div className="absolute inset-0 bg-blotter-perf opacity-30 mix-blend-overlay" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-acidgreen mb-4">
            The Virtual Showroom
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-900 leading-[0.95] mb-6">
            WALK INTO <GlowText>A SHOP</GlowText> THAT DOESN&apos;T EXIST
          </h2>
          <p className="font-body text-paper/60 mb-8 max-w-md">
            Racks, mannequins, a rotating sacred-geometry rig overhead — move
            through it with WASD, drag to look, click any garment to inspect
            and add it to your bag.
          </p>
          <Link href="/shop">
            <Button size="lg">Enter The Showroom</Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest text-paper/60">
          {[
            ["W A S D", "Walk the floor"],
            ["Drag", "Look around"],
            ["Click", "Inspect + buy"],
          ].map(([key, desc]) => (
            <div
              key={key}
              className="border border-dashed border-paper/30 rounded-xl p-4 text-center bg-void/40"
            >
              <p className="text-acidgreen text-sm mb-2">{key}</p>
              <p className="text-paper/50 normal-case tracking-normal">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({ products }: { products: Product[] }) {
  return (
    <section className="py-24 mx-auto max-w-7xl px-5 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <SectionHeading eyebrow="AM-024 · Current Drop" title="Featured Pieces" />
        <Link href="/collections" className="font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-acidgreen underline underline-offset-4">
          View all collections →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <ProductModal />
    </section>
  );
}

function ManifestoTeaser() {
  return (
    <section className="py-24 border-y border-paper/10 bg-void-2">
      <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-magenta mb-6">
          The Manifesto
        </p>
        <blockquote className="font-display text-3xl md:text-4xl font-700 leading-tight mb-8">
          &ldquo;A platform can pull a listing.
          <br />
          It can&apos;t pull a hoodie off your back.&rdquo;
        </blockquote>
        <Link href="/about">
          <Button variant="secondary" size="md">Read The Full Manifesto</Button>
        </Link>
      </div>
    </section>
  );
}

function GalleryTeaser() {
  return (
    <section className="py-24 mx-auto max-w-7xl px-5 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <SectionHeading eyebrow="Sound & Vision" title="From The Gallery" />
        <Link href="/gallery" className="font-mono text-xs uppercase tracking-widest text-paper/50 hover:text-acidgreen underline underline-offset-4">
          See full gallery →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {GALLERY_PREVIEW.map((src) => (
          <Link key={src} href="/gallery" className="relative aspect-[4/5] rounded-xl overflow-hidden border border-paper/10">
            <Image src={src} alt="Acidmath campaign" fill className="object-cover" sizes="33vw" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet/20 via-void to-magenta/10" />
      <div className="relative mx-auto max-w-2xl px-5 md:px-8 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-900 mb-4">
          NEXT SHEET DROPS SOON
        </h2>
        <p className="font-body text-paper/60 mb-8">
          Get on the list — batches sell out and don&apos;t come back.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-10"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 bg-void-2 border border-paper/20 rounded-full px-5 py-3 font-mono text-sm text-paper placeholder:text-paper/30 focus:outline-none focus:border-acidgreen"
          />
          <Button type="submit">{submitted ? "You're In" : "Notify Me"}</Button>
        </form>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop"><Button size="lg">Enter The Showroom</Button></Link>
          <Link href="/collections"><Button size="lg" variant="secondary">Shop The Drop</Button></Link>
        </div>
      </div>
    </section>
  );
}

export function HomeSections({ products }: { products: Product[] }) {
  return (
    <>
      <ShowroomTeaser />
      <PerforatedDivider />
      <FeaturedCollection products={products} />
      <ManifestoTeaser />
      <GalleryTeaser />
      <FinalCTA />
    </>
  );
}
