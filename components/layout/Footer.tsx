import Link from "next/link";
import { PerforatedDivider } from "@/components/ui/BlotterTab";

export function Footer() {
  return (
    <footer className="bg-void-2 border-t border-paper/10 mt-24">
      <PerforatedDivider />
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <p className="font-display text-2xl font-700 mb-3">
            ACID<span className="text-magenta">MATH</span>
          </p>
          <p className="font-body text-paper/50 text-sm max-w-xs leading-relaxed">
            Blotter to body. Printed on fabric, not paper — and never censored.
            Cut and sewn in the USA &amp; Canada.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-acidgreen mb-4">Shop</p>
          <ul className="space-y-2 font-body text-sm text-paper/60">
            <li><Link href="/shop" className="hover:text-paper">Showroom</Link></li>
            <li><Link href="/collections" className="hover:text-paper">Collections</Link></li>
            <li><Link href="/mirror" className="hover:text-paper">Virtual Mirror</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-acidgreen mb-4">Brand</p>
          <ul className="space-y-2 font-body text-sm text-paper/60">
            <li><Link href="/about" className="hover:text-paper">Manifesto</Link></li>
            <li><Link href="/gallery" className="hover:text-paper">Gallery</Link></li>
            <li><a href="mailto:hello@acidmath.com" className="hover:text-paper">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 pb-8 flex flex-col md:flex-row gap-3 justify-between text-xs font-mono text-paper/30 uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Acidmath. All rights reserved.</span>
        <span>Made in USA &amp; Canada · Made to order · No censorship.</span>
      </div>
    </footer>
  );
}
