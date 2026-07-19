"use client";

import { Product } from "@/lib/types";
import { InteractiveGarment } from "./InteractiveGarment";

export function GarmentRack({
  position,
  width = 3,
  products,
}: {
  position: [number, number, number];
  width?: number;
  products: Product[];
}) {
  const railHeight = 1.7;

  return (
    <group position={position}>
      {/* Rail */}
      <mesh position={[0, railHeight, 0]}>
        <cylinderGeometry args={[0.025, 0.025, width, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Stands */}
      {[-width / 2, width / 2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, railHeight / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, railHeight, 12]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Garments spaced evenly along the rail */}
      {products.map((product, i) => {
        const spacing = width / (products.length + 1);
        const x = -width / 2 + spacing * (i + 1);
        return (
          <InteractiveGarment
            key={product.id}
            product={product}
            position={[x, railHeight - 0.65, 0]}
            kind={product.category === "hoodie" ? "hoodie" : "tee"}
          />
        );
      })}
    </group>
  );
}
