"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SacredGeometry({ position = [0, 3.2, -4] as [number, number, number] }) {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const outerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.1, 1), []);
  const innerGeo = useMemo(() => new THREE.OctahedronGeometry(0.65, 0), []);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.15;
      outerRef.current.rotation.x += delta * 0.05;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.25;
      innerRef.current.rotation.z += delta * 0.1;
    }
    if (lightRef.current) {
      const hue = (state.clock.elapsedTime * 0.03) % 1;
      colorObj.setHSL(hue, 0.9, 0.6);
      lightRef.current.color = colorObj;
      lightRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.6;
    }
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} distance={12} decay={2} intensity={3} />

      <group ref={outerRef}>
        <lineSegments>
          <edgesGeometry args={[outerGeo]} />
          <lineBasicMaterial color="#FF2E9A" transparent opacity={0.7} />
        </lineSegments>
      </group>

      <group ref={innerRef}>
        <lineSegments>
          <edgesGeometry args={[innerGeo]} />
          <lineBasicMaterial color="#39FF6A" transparent opacity={0.8} />
        </lineSegments>
      </group>

      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#F4F1E8" />
      </mesh>
    </group>
  );
}
