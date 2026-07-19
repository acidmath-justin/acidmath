import * as THREE from "three";

/**
 * Builds a simple, stylized garment silhouette (a tee/hoodie outline) as a
 * flat extruded shape. This keeps the showroom fully self-contained (no
 * external .glb model downloads) while still reading clearly as "a hanging
 * garment" from a shopping distance. Swap for real scanned/modeled garments
 * (see README > "Upgrading the showroom") once product photography exists.
 */
export function createGarmentGeometry(kind: "tee" | "hoodie" | "jacket" = "tee") {
  const shape = new THREE.Shape();
  const shoulderW = kind === "jacket" ? 0.62 : 0.55;
  const bodyW = kind === "jacket" ? 0.5 : 0.42;
  const height = kind === "hoodie" ? 1.05 : 0.95;
  const sleeveLen = kind === "hoodie" ? 0.42 : 0.32;

  shape.moveTo(-shoulderW, height);
  shape.lineTo(-shoulderW - sleeveLen, height - 0.28);
  shape.lineTo(-shoulderW - sleeveLen + 0.14, height - 0.55);
  shape.lineTo(-bodyW, height - 0.32);
  shape.lineTo(-bodyW, -0.1);
  shape.quadraticCurveTo(-bodyW, -0.2, -bodyW + 0.1, -0.2);
  shape.lineTo(bodyW - 0.1, -0.2);
  shape.quadraticCurveTo(bodyW, -0.2, bodyW, -0.1);
  shape.lineTo(bodyW, height - 0.32);
  shape.lineTo(shoulderW + sleeveLen - 0.14, height - 0.55);
  shape.lineTo(shoulderW + sleeveLen, height - 0.28);
  shape.lineTo(shoulderW, height);

  // Neckline notch
  const neck = new THREE.Path();
  neck.absarc(0, height, 0.16, 0, Math.PI, false);
  shape.holes.push(neck);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 12,
  });
  geometry.center();
  geometry.computeVertexNormals();

  // Re-map UVs to 0-1 across the bounding box so the blotter texture
  // (and Decal projections) map cleanly onto the front face
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const uv = geometry.attributes.uv;
  const pos = geometry.attributes.position;
  for (let i = 0; i < uv.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uv.setXY(i, (x - bbox.min.x) / size.x, (y - bbox.min.y) / size.y);
  }
  uv.needsUpdate = true;

  return geometry;
}

type DrapeProfile = { height: number; stiffness: number; widthAt: (v: number) => number };

// Piecewise-linear width curve from hem (v=0) to collar (v=1) — narrower at
// the hem, widest around the chest, tapering back in at the shoulder seam.
const GARMENT_DRAPE_PROFILES: Record<"tee" | "hoodie" | "jacket", DrapeProfile> = {
  tee: {
    height: 0.62,
    stiffness: 0.3,
    widthAt: (v) =>
      lerpPoints(v, [
        [0, 0.74],
        [0.55, 0.86],
        [0.85, 0.92],
        [1, 0.68],
      ]),
  },
  hoodie: {
    height: 0.76,
    stiffness: 0.2,
    widthAt: (v) =>
      lerpPoints(v, [
        [0, 0.82],
        [0.5, 0.94],
        [0.85, 1.0],
        [1, 0.72],
      ]),
  },
  jacket: {
    height: 0.72,
    stiffness: 0.7,
    widthAt: (v) =>
      lerpPoints(v, [
        [0, 0.86],
        [0.5, 0.96],
        [0.85, 1.02],
        [1, 0.74],
      ]),
  },
};

function lerpPoints(v: number, points: [number, number][]) {
  for (let i = 0; i < points.length - 1; i++) {
    const [v0, w0] = points[i];
    const [v1, w1] = points[i + 1];
    if (v >= v0 && v <= v1) {
      const t = (v - v0) / (v1 - v0 || 1);
      return w0 + (w1 - w0) * t;
    }
  }
  return points[points.length - 1][1];
}

/**
 * Builds a garment as a dense grid wrapped around a vertical cylinder of the
 * given radius — this is what makes it look "draped over a body" instead of
 * a flat decal. It's a geometric approximation (no cloth physics): width
 * tapers hem → chest → shoulder per `GARMENT_DRAPE_PROFILES`, and a small
 * per-vertex droop is added at the sides for a touch of fabric sag, scaled
 * down for stiffer fabrics (jackets) vs. soft ones (tees).
 *
 * Geometry is NOT centered — y runs from 0 (hem) to profile.height (collar)
 * — so the caller positions the group by setting `y` to wherever the body's
 * waistline should be (see AvatarViewer.tsx / ARFittingView.tsx).
 *
 * Use with `side: THREE.DoubleSide` on the material: with only a front torso
 * panel modeled (no back panel — unnecessary for a front-on preview), the
 * winding direction is intentionally left unverified and DoubleSide plus
 * three's automatic front/back normal flip guarantees correct lighting from
 * either camera angle regardless.
 */
export function createDrapedGarmentGeometry(
  kind: "tee" | "hoodie" | "jacket" = "tee",
  radius = 0.34
) {
  const widthSegments = 28;
  const heightSegments = 20;
  const profile = GARMENT_DRAPE_PROFILES[kind];

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;
    const width = profile.widthAt(v);
    const y = v * profile.height;

    for (let ix = 0; ix <= widthSegments; ix++) {
      const u = ix / widthSegments;
      const localX = (u - 0.5) * width;
      const angle = localX / radius;

      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      const sag =
        (1 - profile.stiffness) * 0.02 * Math.sin(angle) ** 2 * Math.sin(Math.PI * v);

      positions.push(x, y - sag, z);
      uvs.push(u, v);
    }
  }

  const rowLen = widthSegments + 1;
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = iy * rowLen + ix;
      const b = a + 1;
      const c = a + rowLen;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
