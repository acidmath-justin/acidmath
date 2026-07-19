"use client";

import { useEffect, useState } from "react";

export type DeviceCapability = {
  isMobile: boolean;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  hasWebGL: boolean;
  isLowPower: boolean; // heuristic: mobile OR low core count OR reduced motion
  checked: boolean; // becomes true once detection has run client-side
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * The 3D showroom and virtual mirror are expensive. This hook gives every
 * heavy scene a single source of truth for whether to render the full
 * experience or the lightweight fallback (see MobileShowcase.tsx).
 */
export function useDeviceCapability(): DeviceCapability {
  const [state, setState] = useState<DeviceCapability>({
    isMobile: false,
    isTouch: false,
    prefersReducedMotion: false,
    hasWebGL: true,
    isLowPower: false,
    checked: false,
  });

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasWebGL = detectWebGL();
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory <= 4 : false;

    setState({
      isMobile,
      isTouch,
      prefersReducedMotion,
      hasWebGL,
      isLowPower: !hasWebGL || prefersReducedMotion || (isMobile && (lowCores || lowMemory)),
      checked: true,
    });
  }, []);

  return state;
}
