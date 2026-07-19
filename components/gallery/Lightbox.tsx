"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: { src: string; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[90] bg-void/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-paper/60 hover:text-paper"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 md:left-8 text-paper/50 hover:text-acidgreen"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[80vh] w-full aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].src}
              alt={images[index].caption ?? "Acidmath gallery image"}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-3 md:right-8 text-paper/50 hover:text-acidgreen"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
