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

/**
 * Mirrors AvatarViewer.tsx's AvatarMesh tree, but built with imperative
 * THREE.Object3D calls instead of R3F/JSX — this is the version used inside
 * the WebXR AR session (see ARFittingView.tsx), which manages its own
 * THREE.Scene directly rather than going through a React Three Fiber
 * <Canvas>. Keep the two in sync if you change body proportions or garment
 * placement — the underlying math (getAvatarProportions,
 * createDrapedGarmentGeometry) is shared, only the assembly differs.
 */
export function buildWearerGroup(
  profile: BodyProfile,
  product: Product | undefined,
  textureLoader: THREE.TextureLoader
) {
  const root = new THREE.Group();
  const { heightScale, girthScale, hipScale } = getAvatarProportions(profile);
  const hipLocalScale = hipScale / girthScale;

  const body = new THREE.Group();
  body.scale.set(girthScale, heightScale, girthScale);
  root.add(body);

  const skinMat = new THREE.MeshStandardMaterial({ color: profile.skinTone, roughness: 0.75 });

  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.8, 4, 8), skinMat);
  legL.position.set(-0.14, 0.55, 0);
  legL.castShadow = legL.receiveShadow = true;
  body.add(legL);

  const legR = legL.clone();
  legR.position.x = 0.14;
  body.add(legR);

  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 16), skinMat);
  hip.position.set(0, 1.0, 0);
  hip.scale.set(hipLocalScale, 1, hipLocalScale);
  hip.castShadow = hip.receiveShadow = true;
  body.add(hip);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.58, 6, 16), skinMat);
  torso.position.set(0, 1.42, 0);
  torso.castShadow = torso.receiveShadow = true;
  body.add(torso);

  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.58, 4, 8), skinMat);
  armL.position.set(-0.45, 1.42, 0);
  armL.rotation.z = 0.15;
  armL.castShadow = armL.receiveShadow = true;
  body.add(armL);

  const armR = armL.clone();
  armR.position.x = 0.45;
  armR.rotation.z = -0.15;
  body.add(armR);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 24), skinMat);
  head.position.set(0, 2.12, 0);
  head.castShadow = head.receiveShadow = true;
  body.add(head);

  const kind = product ? CATEGORY_TO_GARMENT_KIND[product.category] : undefined;
  if (kind && product) {
    const garmentGeo = createDrapedGarmentGeometry(kind);
    const garmentTex = textureLoader.load(product.textureUrl);
    const garmentMat = new THREE.MeshStandardMaterial({
      map: garmentTex,
      roughness: 0.75,
      metalness: 0.05,
      emissive: new THREE.Color("#7B2FF7"),
      emissiveMap: garmentTex,
      emissiveIntensity: 0.18,
      side: THREE.DoubleSide,
    });
    const garment = new THREE.Mesh(garmentGeo, garmentMat);
    garment.position.set(0, 0.95, 0);
    garment.castShadow = garment.receiveShadow = true;
    body.add(garment);
  }

  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.5, 0.06, 32),
    new THREE.MeshStandardMaterial({ color: "#0a0a0a", metalness: 0.6, roughness: 0.4 })
  );
  plinth.position.set(0, 0.03, 0);
  plinth.receiveShadow = true;
  body.add(plinth);

  return root;
}
