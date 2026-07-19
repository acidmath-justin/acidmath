"use client";

import { useEffect, useRef } from "react";

export type MovementState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
};

const KEY_MAP: Record<string, keyof Omit<MovementState, "run">> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

/**
 * Returns a mutable ref (not state) so the R3F render loop can read the
 * latest key state every frame without triggering React re-renders.
 */
export function useKeyboardControls() {
  const movement = useRef<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) movement.current[dir] = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") movement.current.run = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) movement.current[dir] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") movement.current.run = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return movement;
}
