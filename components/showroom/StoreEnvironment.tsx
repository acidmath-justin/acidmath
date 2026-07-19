"use client";

import { Grid } from "@react-three/drei";
import * as THREE from "three";

export function StoreEnvironment() {
  return (
    <group>
      {/* Neon floor grid — reads as a rave-floor / showroom checkerboard */}
      <Grid
        position={[0, 0, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#3a1a5c"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#FF2E9A"
        fadeDistance={22}
        fadeStrength={1.5}
        infiniteGrid
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#05050A" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 4, -8]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#0a0a14" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#0a0a14" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[10, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#0a0a14" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Rim lights washing the walls in brand colors */}
      <pointLight position={[-8, 3, -6]} color="#7B2FF7" intensity={4} distance={10} />
      <pointLight position={[8, 3, -6]} color="#FF2E9A" intensity={4} distance={10} />
      <pointLight position={[0, 2.5, 4]} color="#39FF6A" intensity={2} distance={8} />
    </group>
  );
}
