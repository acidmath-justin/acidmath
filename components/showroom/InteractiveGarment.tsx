"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/lib/types";
import { createGarmentGeometry } from "./garmentShapes";
import { useShowroomStore } from "@/store/showroomStore";

export function InteractiveGarment({
  product,
  position,
  kind = "tee",
}: {
  product: Product;
  position: [number, number, number];
  kind?: "tee" | "hoodie" | "jacket";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setHoveredGlobal = useShowroomStore((s) => s.setHovered);
  const setActiveProduct = useShowroomStore((s) => s.setActiveProduct);

  const geometry = useMemo(() => createGarmentGeometry(kind), [kind]);
  const texture = useTexture(product.textureUrl);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle hanger sway, plus a lift + glow response on hover
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.z = Math.sin(t * 0.6 + position[0]) * 0.03;
    const targetScale = hovered ? 1.08 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered ? 0.9 : 0.15, 0.15);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
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
        <meshStandardMaterial
          map={texture}
          emissive={new THREE.Color("#FF2E9A")}
          emissiveIntensity={0.15}
          emissiveMap={texture}
          roughness={0.55}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 1.3, 0]} center distanceFactor={8} occlude>
          <div className="pointer-events-none whitespace-nowrap rounded-full border border-acidgreen/60 bg-void/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-acidgreen shadow-neon-green">
            {product.title} · ${product.price}
          </div>
        </Html>
      )}
    </group>
  );
}
