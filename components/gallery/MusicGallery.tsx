"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "./Lightbox";

const GALLERY_IMAGES = [
  { src: "https://placehold.co/800x1000/1a0a2e/F4F1E8?text=Campaign+01", caption: "Drop AM-014 campaign" },
  { src: "https://placehold.co/800x600/0a0a14/FF2E9A?text=Campaign+02", caption: "Studio session" },
  { src: "https://placehold.co/800x1000/111120/39FF6A?text=Campaign+03", caption: "Street cut" },
  { src: "https://placehold.co/800x600/05050A/7B2FF7?text=Campaign+04", caption: "Blacklight test shots" },
  { src: "https://placehold.co/800x1000/1a0a2e/FFB627?text=Campaign+05", caption: "Warehouse fitting" },
  { src: "https://placehold.co/800x600/0a0a14/F4F1E8?text=Campaign+06", caption: "Print floor" },
];

export function MusicGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID || "37i9dQZF1DXc8kgYqQL7bR";

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Sound & Vision"
          title="Gallery"
          description="Campaign stills from the current drop, and the playlist we cut it to."
          className="mb-12"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 [&>*:nth-child(1)]:row-span-2 [&>*:nth-child(3)]:row-span-2">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setLightboxIndex(i)}
              className="relative rounded-xl overflow-hidden border border-paper/10 hover:border-magenta/50 transition-colors group"
            >
              <Image
                src={img.src}
                alt={img.caption}
                width={800}
                height={i % 2 === 0 ? 1000 : 600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-paper/10 bg-void-2 p-1">
          <iframe
            title="Acidmath playlist"
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            style={{ borderRadius: "12px", border: "none" }}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      </div>

      <Lightbox
        images={GALLERY_IMAGES}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
