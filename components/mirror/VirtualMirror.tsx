"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import clsx from "clsx";
import { Product, BodyProfile } from "@/lib/types";
import { BodyForm } from "./BodyForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const AvatarViewer = dynamic(() => import("./AvatarViewer").then((m) => m.AvatarViewer), {
  ssr: false,
  loading: () => <div className="h-[420px] md:h-[560px] rounded-2xl canvas-skeleton" />,
});

const ARFittingView = dynamic(() => import("./ARFittingView").then((m) => m.ARFittingView), {
  ssr: false,
  loading: () => <div className="h-[420px] md:h-[560px] rounded-2xl canvas-skeleton" />,
});

const PoseOverlayAR = dynamic(() => import("./PoseOverlayAR").then((m) => m.PoseOverlayAR), {
  ssr: false,
});

type Mode = "avatar" | "ar" | "mirror";

const TABS: { value: Mode; label: string; accent: string }[] = [
  { value: "avatar", label: "3D Avatar", accent: "border-violet text-violet" },
  { value: "ar", label: "AR Mode", accent: "border-acidgreen text-acidgreen" },
  { value: "mirror", label: "Real Mirror", accent: "border-magenta text-magenta" },
];

export function VirtualMirror({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | undefined>(products[0]);
  const [mode, setMode] = useState<Mode>("avatar");
  const [profile, setProfile] = useState<BodyProfile>({
    heightCm: 175,
    weightKg: 72,
    bodyType: "athletic",
    skinTone: "#C98F65",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 pt-32 pb-24">
      <SectionHeading
        eyebrow="Try Before You Tear"
        title="The Mirror"
        description="Dial in a body profile for a scaled 3D preview, drop a life-size hologram into your room with AR, or step in front of your webcam for a live overlay — all on-device."
        className="mb-12"
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Garment picker */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-3">
            Pick a garment
          </p>
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={clsx(
                  "shrink-0 lg:shrink flex items-center gap-3 rounded-xl border p-2 text-left transition-colors w-40 lg:w-full",
                  selected?.id === p.id
                    ? "border-magenta shadow-neon"
                    : "border-paper/10 hover:border-paper/30"
                )}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-void">
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs text-paper truncate">{p.title}</p>
                  <p className="font-mono text-[10px] text-paper/40">${p.price}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <BodyForm profile={profile} onChange={setProfile} />
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setMode(tab.value)}
                className={clsx(
                  "font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors",
                  mode === tab.value ? tab.accent : "border-paper/20 text-paper/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === "avatar" && <AvatarViewer profile={profile} product={selected} />}

          {mode === "ar" && (
            <ErrorBoundary
              fallback={
                <div className="h-[420px] md:h-[560px] rounded-2xl bg-void-2 border border-paper/10 grid place-items-center p-8 text-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-magenta mb-3">
                      AR view hit a snag
                    </p>
                    <p className="font-body text-paper/60 text-sm max-w-sm mx-auto">
                      Your browser&apos;s WebXR support didn&apos;t behave as
                      expected. Try the Real Mirror tab instead.
                    </p>
                  </div>
                </div>
              }
            >
              {selected ? (
                <ARFittingView
                  profile={profile}
                  product={selected}
                  onFallbackToCamera={() => setMode("mirror")}
                />
              ) : null}
            </ErrorBoundary>
          )}

          {mode === "mirror" && selected && (
            <PoseOverlayAR garmentImageUrl={selected.textureUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
