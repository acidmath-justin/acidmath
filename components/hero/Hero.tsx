"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowText } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

const FractalBackground = dynamic(
  () => import("./FractalBackground").then((m) => m.FractalBackground),
  { ssr: false }
);

export function Hero() {
  const { isLowPower, checked } = useDeviceCapability();

  return (
    <section className="relative h-[100svh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        {checked && !isLowPower ? (
          <FractalBackground className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 bg-blotter-wash bg-void" />
        )}
        <div className="absolute inset-0 bg-blotter-perf opacity-40 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-acidgreen mb-6"
        >
          Batch AM-001 · Printed, Not Censored
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-900 text-[15vw] md:text-8xl leading-[0.9] mb-6"
        >
          <GlowText>BLOTTER</GlowText>
          <br />
          <span className="text-paper">TO BODY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-paper/60 text-base md:text-lg max-w-lg mx-auto mb-10"
        >
          Enlarged acid blotter grids, hand-overlaid and printed on premium
          fabric — not paper. Cut and sewn in the USA &amp; Canada. Nothing about
          this brand asks permission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop">
            <Button size="lg">Enter The Showroom</Button>
          </Link>
          <Link href="/collections">
            <Button size="lg" variant="secondary">
              Shop The Drop
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-paper/40 uppercase"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
