import { BodyProfile } from "./types";

const CHEST_MULTIPLIER: Record<BodyProfile["bodyType"], number> = {
  slim: 0.86,
  athletic: 1.0,
  curvy: 1.05,
  plus: 1.32,
};

// Applied on top of the chest multiplier so "curvy" reads as a proportionally
// wider hip/waist relative to the chest, rather than just "bigger everywhere".
const HIP_MULTIPLIER: Record<BodyProfile["bodyType"], number> = {
  slim: 0.98,
  athletic: 1.0,
  curvy: 1.18,
  plus: 1.15,
};

export type AvatarProportions = {
  heightScale: number;
  girthScale: number; // chest / shoulder width factor
  hipScale: number; // hip / waist width factor (used by a separate hip mesh)
};

export function getAvatarProportions(profile: BodyProfile): AvatarProportions {
  const heightScale = clamp(profile.heightCm / 175, 0.82, 1.22);
  const bmi = profile.weightKg / Math.pow(profile.heightCm / 100, 2);
  const girthBase = clamp(bmi / 22, 0.78, 1.55);

  const girthScale = clamp(girthBase * CHEST_MULTIPLIER[profile.bodyType], 0.75, 1.65);
  const hipScale = clamp(
    girthBase * CHEST_MULTIPLIER[profile.bodyType] * HIP_MULTIPLIER[profile.bodyType],
    0.75,
    1.85
  );

  return { heightScale, girthScale, hipScale };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * The avatar's local unit scale (legs + torso + head, at heightScale = 1)
 * works out to roughly 2.3 units tall. In the AR view those units become
 * real-world meters, so we scale the whole placed group by this factor to
 * land close to an actual 1.75m person at baseline proportions. It's a
 * approximation, not a calibrated measurement — good enough for "does this
 * hoodie look about my size in my room", not for tailoring.
 */
export const AVATAR_TO_METERS = 1.75 / 2.3;
