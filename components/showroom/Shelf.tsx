"use client";

import { useState } from "react";
import { Html, useTexture } from "@react-three/drei";
import { Product } from "@/lib/types";
import { useShowroomStore } from "@/store/showroomStore";

function FoldedItem({ product, offset }: { product: Product; offset: number }) {
  const [hovered, setHovered] = useState(false);
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);
  const setHoveredGlobal = useShowroomStore((s) => s.setHovered);
  const texture = useTexture(product.textureUrl);

  return (
    <group
      position={[offset, 0.09, 0]}
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
      scale={hovered ? 1.08 : 1}
    >
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.32, 0.1, 0.24]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.22]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FFB627"
          emissiveIntensity={hovered ? 0.7 : 0.1}
          emissiveMap={texture}
        />
      </mesh>
      {hovered && (
        <Html position={[0, 0.5, 0]} center distanceFactor={8} occlude>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-amber/60 bg-void/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber shadow-neon">
            {product.title} · ${product.price}
          </div>
        </Html>
      )}
    </group>
  );
}

export function Shelf({
  position,
  width = 1.8,
  products,
}: {
  position: [number, number, number];
  width?: number;
  products: Product[];
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, 0.06, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Wall brackets */}
      {[-width / 2 + 0.15, width / 2 - 0.15].map((x) => (
        <mesh key={x} position={[x, -0.15, -0.15]}>
          <boxGeometry args={[0.04, 0.24, 0.04]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      ))}
      {products.map((product, i) => {
        const spacing = width / (products.length + 1);
        const x = -width / 2 + spacing * (i + 1);
        return <FoldedItem key={product.id} product={product} offset={x} />;
      })}
    </group>
  );
}
