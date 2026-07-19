"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BodyProfile, Product } from "@/lib/types";
import { getAvatarProportions } from "@/lib/avatarProportions";
import { createDrapedGarmentGeometry } from "@/components/showroom/garmentShapes";

const CATEGORY_TO_GARMENT_KIND: Partial<Record<Product["category"], "tee" | "hoodie" | "jacket">> = {
  tee: "tee",
  "long-sleeve": "tee",
  hoodie: "hoodie",
  jacket: "jacket",
};

function GarmentLayer({ product }: { product: Product }) {
  const kind = CATEGORY_TO_GARMENT_KIND[product.category];
  const texture = useTexture(product.textureUrl);
  const geometry = useMemo(() => (kind ? createDrapedGarmentGeometry(kind) : null), [kind]);

  if (!geometry) return null; // accessories aren't worn on the torso in this preview

  return (
    <group position={[0, 0.95, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          map={texture}
          roughness={0.75}
          metalness={0.05}
          emissive="#7B2FF7"
          emissiveMap={texture}
          emissiveIntensity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function AvatarMesh({ profile, product }: { profile: BodyProfile; product?: Product }) {
  const groupRef = useRef<THREE.Group>(null);
  const { heightScale, girthScale, hipScale } = useMemo(
    () => getAvatarProportions(profile),
    [profile]
  );
  // Hip mesh sits inside the same parent (already scaled by girthScale on
  // X/Z), so its own local scale only needs to cover the *extra* width
  // beyond the chest — this is what lets "curvy" widen hips independently
  // of the chest instead of just scaling the whole body uniformly.
  const hipLocalScale = hipScale / girthScale;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef} scale={[girthScale, heightScale, girthScale]}>
      {/* Legs */}
      <mesh position={[-0.14, 0.55, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>
      <mesh position={[0.14, 0.55, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>

      {/* Hip / waist bulge — scaled independently of the chest, see above */}
      <mesh position={[0, 1.0, 0]} scale={[hipLocalScale, 1, hipLocalScale]} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 20, 16]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.58, 6, 16]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.45, 1.42, 0]} rotation={[0, 0, 0.15]} castShadow receiveShadow>
        <capsuleGeometry args={[0.085, 0.58, 4, 8]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>
      <mesh position={[0.45, 1.42, 0]} rotation={[0, 0, -0.15]} castShadow receiveShadow>
        <capsuleGeometry args={[0.085, 0.58, 4, 8]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.75} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.12, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color={profile.skinTone} roughness={0.8} />
      </mesh>

      {product && <GarmentLayer product={product} />}

      {/* Plinth */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.06, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function AvatarViewer({ profile, product }: { profile: BodyProfile; product?: Product }) {
  return (
    <div className="relative w-full h-[420px] md:h-[560px] rounded-2xl overflow-hidden bg-void-2 border border-paper/10">
      <Canvas shadows camera={{ position: [0, 1.4, 3.2], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[2, 4, 2]}
          intensity={1.4}
          color="#F4F1E8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2, 2, -2]} color="#39FF6A" intensity={1} />
        <pointLight position={[2, 1, -2]} color="#FF2E9A" intensity={0.8} />
        <Suspense fallback={null}>
          <AvatarMesh profile={profile} product={product} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-paper/40 bg-void/60 px-2 py-1 rounded">
        Drag to rotate
      </div>
    </div>
  );
}
