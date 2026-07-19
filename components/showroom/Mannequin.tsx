"use client";

import { useState } from "react";
import { Decal, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/lib/types";
import { useShowroomStore } from "@/store/showroomStore";

export function Mannequin({
  product,
  position,
}: {
  product: Product;
  position: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);
  const setHoveredGlobal = useShowroomStore((s) => s.setHovered);
  const texture = useTexture(product.textureUrl);

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredGlobal(product.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        setHoveredGlobal(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveProduct(product);
      }}
    >
      {/* Plinth */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.1, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.13, 0.55, 0]}>
        <capsuleGeometry args={[0.09, 0.75, 4, 8]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.7} />
      </mesh>
      <mesh position={[0.13, 0.55, 0]}>
        <capsuleGeometry args={[0.09, 0.75, 4, 8]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.7} />
      </mesh>

      {/* Torso wearing the garment texture */}
      <mesh position={[0, 1.35, 0]} scale={hovered ? 1.04 : 1}>
        <capsuleGeometry args={[0.28, 0.55, 6, 16]} />
        <meshStandardMaterial color="#f4f1e8" roughness={0.6} />
        <Decal position={[0, 0.05, 0.27]} rotation={[0, 0, 0]} scale={[0.5, 0.65, 0.5]}>
          <meshStandardMaterial
            map={texture}
            polygonOffset
            polygonOffsetFactor={-4}
            emissive="#7B2FF7"
            emissiveIntensity={hovered ? 0.6 : 0.1}
            emissiveMap={texture}
            transparent
          />
        </Decal>
      </mesh>

      {/* Arms */}
      <mesh position={[-0.42, 1.35, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.08, 0.55, 4, 8]} />
        <meshStandardMaterial color="#f4f1e8" roughness={0.6} />
      </mesh>
      <mesh position={[0.42, 1.35, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.08, 0.55, 4, 8]} />
        <meshStandardMaterial color="#f4f1e8" roughness={0.6} />
      </mesh>

      {/* Head — faceless, mannequin-style */}
      <mesh position={[0, 2.02, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#d8d4c8" roughness={0.8} />
      </mesh>

      {hovered && (
        <Html position={[0, 2.35, 0]} center distanceFactor={8} occlude>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-magenta/60 bg-void/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-magenta shadow-neon">
            {product.title} · ${product.price}
          </div>
        </Html>
      )}
    </group>
  );
}
