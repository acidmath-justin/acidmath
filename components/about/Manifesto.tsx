"use client";

import { motion } from "framer-motion";
import { PerforatedDivider } from "@/components/ui/BlotterTab";
import { GlowText } from "@/components/ui/SectionHeading";

const CLAUSES = [
  {
    title: "Fabric Doesn't Get Flagged",
    body: "A platform can pull a listing. It can't pull a hoodie off your back. Every design we make lives permanently on something a shipping algorithm can't touch — that's the whole premise of Blotter to Body.",
  },
  {
    title: "We Print What We Want",
    body: "No design here has been softened for a marketplace's content policy. If a piece feels too loud, too strange, or too much — that's the piece working as intended, not a mistake to fix.",
  },
  {
    title: "Made Where We Can Watch It Being Made",
    body: "Every garment is cut and sewn in the USA or Canada, in shops we've actually stood in. Not because it's cheaper — it isn't — but because we won't sell you something we can't trace.",
  },
  {
    title: "Small Batches, On Purpose",
    body: "Each drop is numbered like the sheet it came from. When a batch sells out, it's gone — we don't restock into infinity just to keep a listing live.",
  },
];

function Clause({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-8 py-10 border-b border-paper/10"
    >
      <span className="font-mono text-3xl text-magenta/60">{String(index).padStart(2, "0")}</span>
      <div>
        <h3 className="font-display text-2xl md:text-3xl font-700 mb-3">{title}</h3>
        <p className="font-body text-paper/60 leading-relaxed max-w-2xl">{body}</p>
      </div>
    </motion.div>
  );
}

export function Manifesto() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8 mb-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-acidgreen mb-6">
          The Manifesto
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-900 leading-[0.95] mb-8">
          WE DON&apos;T <GlowText>ASK PERMISSION</GlowText>
        </h1>
        <p className="font-body text-paper/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Acidmath started as a scanner, a sheet of blotter art, and a
          question: what happens if you stop treating the drawing as
          contraband and start treating it as a textile? Everything below is
          the answer.
        </p>
      </div>

      <PerforatedDivider className="mb-4" />

      <div className="mx-auto max-w-3xl px-5 md:px-8">
        {CLAUSES.map((c, i) => (
          <Clause key={c.title} index={i + 1} title={c.title} body={c.body} />
        ))}
      </div>

      <div className="mx-auto max-w-3xl px-5 md:px-8 mt-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-paper/40">
          Cut. Sewn. Signed off. Never softened.
        </p>
      </div>
    </div>
  );
}
