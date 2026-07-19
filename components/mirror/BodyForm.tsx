"use client";

import { BodyProfile } from "@/lib/types";
import clsx from "clsx";

const BODY_TYPES: { value: BodyProfile["bodyType"]; label: string }[] = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "curvy", label: "Curvy" },
  { value: "plus", label: "Plus" },
];

// A small, fixed swatch scale rather than an open color picker — keeps the
// choice quick on mobile and keeps the avatar's material list bounded.
const SKIN_TONES = [
  "#F4D6BE",
  "#E8B98C",
  "#C98F65",
  "#A9734C",
  "#7A4B30",
  "#4A2E1E",
];

export function BodyForm({
  profile,
  onChange,
}: {
  profile: BodyProfile;
  onChange: (profile: BodyProfile) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-paper/50 mb-2">
          <span>Height</span>
          <span className="text-acidgreen">{profile.heightCm} cm</span>
        </div>
        <input
          type="range"
          min={140}
          max={210}
          value={profile.heightCm}
          onChange={(e) => onChange({ ...profile, heightCm: Number(e.target.value) })}
          className="w-full accent-magenta"
        />
      </div>

      <div>
        <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-paper/50 mb-2">
          <span>Weight</span>
          <span className="text-acidgreen">{profile.weightKg} kg</span>
        </div>
        <input
          type="range"
          min={40}
          max={150}
          value={profile.weightKg}
          onChange={(e) => onChange({ ...profile, weightKg: Number(e.target.value) })}
          className="w-full accent-magenta"
        />
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-2">Body Shape</p>
        <div className="grid grid-cols-4 gap-2">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.value}
              onClick={() => onChange({ ...profile, bodyType: bt.value })}
              className={clsx(
                "font-mono text-[10px] uppercase tracking-widest py-2 rounded-md border transition-colors",
                profile.bodyType === bt.value
                  ? "border-acidgreen text-acidgreen shadow-neon-green"
                  : "border-paper/20 text-paper/50 hover:border-paper/50"
              )}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-paper/50 mb-2">Skin Tone</p>
        <div className="flex gap-2">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone}
              onClick={() => onChange({ ...profile, skinTone: tone })}
              aria-label={`Skin tone ${tone}`}
              aria-pressed={profile.skinTone === tone}
              style={{ backgroundColor: tone }}
              className={clsx(
                "w-8 h-8 rounded-full border-2 transition-transform",
                profile.skinTone === tone
                  ? "border-acidgreen scale-110 shadow-neon-green"
                  : "border-paper/20 hover:scale-105"
              )}
            />
          ))}
        </div>
      </div>

      <p className="font-mono text-[10px] text-paper/30 leading-relaxed">
        Used only to scale your preview avatar in this browser session —
        never stored or sent to a server.
      </p>
    </div>
  );
}
