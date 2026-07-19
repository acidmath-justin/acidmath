"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore — three's examples/jsm type coverage varies by version; this
// path is stable at runtime (it's been part of three's official WebXR
// examples for years) even when types aren't bundled for it.
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { BodyProfile, Product } from "@/lib/types";
import { AVATAR_TO_METERS } from "@/lib/avatarProportions";
import { buildWearerGroup } from "./buildWearerGroup";
import { Button } from "@/components/ui/Button";

type Support = "checking" | "supported" | "unsupported";

export function ARFittingView({
  profile,
  product,
  onFallbackToCamera,
}: {
  profile: BodyProfile;
  product?: Product;
  onFallbackToCamera: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [support, setSupport] = useState<Support>("checking");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!("xr" in navigator)) {
        if (!cancelled) setSupport("unsupported");
        return;
      }
      try {
        const ok = await (navigator as any).xr.isSessionSupported("immersive-ar");
        if (!cancelled) setSupport(ok ? "supported" : "unsupported");
      } catch {
        if (!cancelled) setSupport("unsupported");
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (support !== "supported" || !containerRef.current || !product) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.01,
      20
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
    });
    container.appendChild(arButton);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1a44, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(1, 2, 1);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const reticleGeometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x39ff6a });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const textureLoader = new THREE.TextureLoader();
    const wearer = buildWearerGroup(profile, product, textureLoader);
    wearer.visible = false;
    scene.add(wearer);

    let hitTestSource: any = null;
    let hitTestSourceRequested = false;

    function onSelect() {
      if (!reticle.visible) return;
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      reticle.matrix.decompose(position, quaternion, new THREE.Vector3());

      wearer.position.copy(position);
      wearer.quaternion.copy(quaternion);
      wearer.scale.setScalar(AVATAR_TO_METERS);
      wearer.visible = true;
      setPlaced(true);
    }

    const controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);

    renderer.setAnimationLoop((_, frame?: any) => {
      wearer.rotation.y += 0.003; // slow turntable once placed, for a showroom feel

      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session: any = renderer.xr.getSession();

        if (!hitTestSourceRequested && session) {
          session
            .requestReferenceSpace("viewer")
            .then((viewerSpace: any) => {
              session.requestHitTestSource?.({ space: viewerSpace }).then((source: any) => {
                hitTestSource = source ?? null;
              });
            })
            .catch(() => {
              /* hit-test unavailable this session — reticle simply won't appear */
            });
          session.addEventListener("end", () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
            setPlaced(false);
          });
          hitTestSourceRequested = true;
        }

        if (hitTestSource && referenceSpace && frame.getHitTestResults) {
          const results = frame.getHitTestResults(hitTestSource);
          if (results.length > 0) {
            const pose = results[0].getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    });

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      controller.removeEventListener("select", onSelect);
      renderer.setAnimationLoop(null);
      renderer.xr.getSession()?.end().catch(() => {});

      [wearer, reticle].forEach((obj) => {
        obj.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((m: THREE.Material & { map?: THREE.Texture }) => {
              m.map?.dispose();
              m.dispose();
            });
          }
        });
      });

      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(arButton)) container.removeChild(arButton);
      renderer.dispose();
    };
  }, [support, profile, product]);

  if (support === "checking") {
    return (
      <div className="h-[420px] md:h-[560px] rounded-2xl bg-void-2 border border-paper/10 grid place-items-center">
        <p className="font-mono text-xs uppercase tracking-widest text-acidgreen animate-pulseGlow">
          Checking AR support…
        </p>
      </div>
    );
  }

  if (support === "unsupported") {
    return (
      <div className="h-[420px] md:h-[560px] rounded-2xl bg-void-2 border border-paper/10 grid place-items-center p-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            WebXR AR isn&apos;t available here
          </p>
          <p className="font-body text-paper/60 text-sm max-w-sm mx-auto mb-6">
            Full AR placement currently needs an AR-capable Android phone in
            Chrome. On this device, try the camera overlay instead — it uses
            your webcam to show the garment on you directly.
          </p>
          <Button variant="secondary" onClick={onFallbackToCamera}>
            Use Camera Overlay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] md:h-[560px] rounded-2xl overflow-hidden bg-void-2 border border-paper/10">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute top-3 left-3 right-3 font-mono text-[10px] uppercase tracking-widest text-paper/60 bg-void/60 backdrop-blur px-3 py-2 rounded-lg">
        {placed
          ? "Placed — tap the floor again to move it"
          : "Tap Start AR, point your phone at the floor, then tap to place a life-size preview"}
      </div>
    </div>
  );
}
