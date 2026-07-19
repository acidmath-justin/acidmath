"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useShowroomStore } from "@/store/showroomStore";

const BOUNDS = { minX: -8.5, maxX: 8.5, minZ: -7, maxZ: 6 };
const EYE_HEIGHT = 1.6;
const WALK_SPEED = 2.6;
const RUN_MULTIPLIER = 1.8;

export function PlayerControls() {
  const { camera, gl } = useThree();
  const movement = useKeyboardControls();
  const setLocked = useShowroomStore((s) => s.setLocked);

  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 5);
    yaw.current = 0; // face -Z, toward the room's fixtures, on load
    camera.rotation.order = "YXZ";
  }, [camera]);

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      setLocked(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
      dom.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.0035;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.0035, -1.0, 1.0);
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging.current = false;
      setLocked(false);
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
    };

    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl, setLocked]);

  useFrame((_, delta) => {
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    const m = movement.current;
    const speed = WALK_SPEED * (m.run ? RUN_MULTIPLIER : 1) * delta;
    const forwardVec = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current));
    const rightVec = new THREE.Vector3(forwardVec.z, 0, -forwardVec.x);

    const move = new THREE.Vector3();
    if (m.forward) move.sub(forwardVec);
    if (m.backward) move.add(forwardVec);
    if (m.right) move.add(rightVec);
    if (m.left) move.sub(rightVec);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed);
      camera.position.x = THREE.MathUtils.clamp(camera.position.x + move.x, BOUNDS.minX, BOUNDS.maxX);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + move.z, BOUNDS.minZ, BOUNDS.maxZ);
    }
    camera.position.y = EYE_HEIGHT;
  });

  return null;
}
