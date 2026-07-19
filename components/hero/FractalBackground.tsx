"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// A domain-warped plasma/kaleidoscope field — evokes a projected blotter
// sheet under blacklight rather than a literal Mandelbrot render, which
// keeps it legible instead of noisy behind headline text.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIntensity;

  // 2D rotation
  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= 1.77;

    // Slowly drift the field toward the pointer for subtle interactivity
    vec2 mouseInfluence = (uMouse - 0.5) * 0.6;
    uv += mouseInfluence * 0.3;

    float t = uTime * 0.08;
    vec2 p = uv;

    // Domain warp: fold space through itself a few times, like blotter
    // perforation tabs repeating outward from a center point
    float scale = 3.0;
    vec3 color = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      p = abs(p) / dot(p, p) - vec2(0.9 + sin(t + float(i)) * 0.1);
      p *= rot(t * 0.15 + float(i) * 0.3);
    }

    float pattern = length(p) * 0.4;
    float bands = sin(pattern * scale + t * 2.0) * 0.5 + 0.5;

    color = mix(uColorA, uColorB, bands);
    color = mix(color, uColorC, smoothstep(0.3, 1.0, length(uv) * 0.5));

    // Vignette so the shader recedes at the edges instead of competing with copy
    float vignette = smoothstep(1.4, 0.2, length(uv));
    color *= vignette * uIntensity;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FractalMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uColorA: new THREE.Color("#7B2FF7"),
    uColorB: new THREE.Color("#FF2E9A"),
    uColorC: new THREE.Color("#39FF6A"),
    uIntensity: 0.85,
  },
  vertexShader,
  fragmentShader
);

extend({ FractalMaterial });

// Note: the JSX intrinsic `<fractalMaterial />` below is untyped (@ts-ignore) —
// R3F v8's global JSX augmentation for custom `extend()`-ed elements is verbose
// for a single one-off shader, so we skip it rather than fight the types.
function PlasmaPlane() {
  const materialRef = useRef<any>(null);
  const { viewport, pointer } = useThree();

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uMouse.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <fractalMaterial ref={materialRef} />
    </mesh>
  );
}

export function FractalBackground({ className }: { className?: string }) {
  const dpr = useMemo<[number, number]>(() => [1, 1.5], []);
  return (
    <Canvas
      className={className}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 1] }}
    >
      <PlasmaPlane />
    </Canvas>
  );
}
