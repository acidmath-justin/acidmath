"use client";

import { Suspense } from "react";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Product } from "@/lib/types";
import { StoreEnvironment } from "./StoreEnvironment";
import { GarmentRack } from "./GarmentRack";
import { Mannequin } from "./Mannequin";
import { Shelf } from "./Shelf";
import { SacredGeometry } from "./SacredGeometry";
import { ParticleField } from "./ParticleField";
import { PlayerControls } from "./PlayerControls";
import * as THREE from "three";

export function Scene({ products }: { products: Product[] }) {
  const mannequinProducts = products.filter((p) => p.showroomSlot?.fixture === "mannequin");
  const shelfProducts = products.filter((p) => p.showroomSlot?.fixture === "shelf");
  const rackProducts = products.filter(
    (p) => !p.showroomSlot || p.showroomSlot.fixture === "rack"
  );

  return (
    <>
      <fog attach="fog" args={["#05050A", 6, 24]} />
      <color attach="background" args={["#05050A"]} />

      <ambientLight intensity={0.35} color="#7B2FF7" />
      <directionalLight position={[3, 6, 4]} intensity={0.4} color="#F4F1E8" />

      <Suspense fallback={null}>
        <StoreEnvironment />
        <SacredGeometry />

        <GarmentRack position={[-2.5, 0, -1]} width={3.2} products={rackProducts.slice(0, 3)} />
        <GarmentRack position={[2.5, 0, 1.5]} width={3.2} products={rackProducts.slice(3, 6)} />

        {mannequinProducts.map((product) => (
          <Mannequin
            key={product.id}
            product={product}
            position={product.showroomSlot!.position}
          />
        ))}

        {shelfProducts.length > 0 && (
          <Shelf position={[1.6, 1.5, -3.95]} width={1.8} products={shelfProducts} />
        )}

        <ParticleField count={400} />
      </Suspense>

      <PlayerControls />

      {/* Bloom picks up every emissive surface (garment glow, sacred geometry,
          particles) — this is the single biggest lever on "trippy" here. */}
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} intensity={0.9} mipmapBlur />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0006, 0.0006)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}
