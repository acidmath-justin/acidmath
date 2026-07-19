"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Product } from "@/lib/types";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useShowroomStore } from "@/store/showroomStore";
import { MobileShowcase } from "./MobileShowcase";
import { ProductModal } from "./ProductModal";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

function ShowroomHUD() {
  const locked = useShowroomStore((s) => s.locked);
  const hoveredProductId = useShowroomStore((s) => s.hoveredProductId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Crosshair */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors"
        style={{ backgroundColor: hoveredProductId ? "#39FF6A" : "rgba(244,241,232,0.5)" }}
      />

      <div className="absolute top-20 left-5 md:left-8 font-mono text-[10px] md:text-xs uppercase tracking-widest text-paper/50 bg-void/50 backdrop-blur px-3 py-2 rounded-lg space-y-1">
        <p><span className="text-acidgreen">WASD</span> — walk</p>
        <p><span className="text-acidgreen">Drag</span> — look around</p>
        <p><span className="text-acidgreen">Click</span> a garment — inspect</p>
      </div>

      {locked && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-paper/40">
          Release to stop looking
        </div>
      )}
    </div>
  );
}

export function Showroom({ products }: { products: Product[] }) {
  const { isLowPower, checked } = useDeviceCapability();
  const [loaded, setLoaded] = useState(false);

  if (!checked) {
    return <div className="h-[100svh] w-full canvas-skeleton" />;
  }

  if (isLowPower) {
    return (
      <>
        <MobileShowcase products={products} />
        <ProductModal />
      </>
    );
  }

  return (
    <div className="relative h-[100svh] w-full bg-void">
      {!loaded && (
        <div className="absolute inset-0 z-20 grid place-items-center canvas-skeleton">
          <p className="font-mono text-xs uppercase tracking-widest text-acidgreen animate-pulseGlow">
            Unfolding the sheet…
          </p>
        </div>
      )}
      <Canvas
        shadows
        camera={{ fov: 65, position: [0, 1.6, 5] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => setLoaded(true)}
      >
        <Suspense fallback={null}>
          <Scene products={products} />
        </Suspense>
      </Canvas>
      <ShowroomHUD />
      <ProductModal />
    </div>
  );
}
