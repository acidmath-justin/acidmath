"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import clsx from "clsx";

const LINKS = [
  { href: "/shop", label: "Showroom" },
  { href: "/mirror", label: "Mirror" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "Manifesto" },
  { href: "/gallery", label: "Gallery" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggle);
  const count = useCartStore((s) => s.totalQuantity());

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-void/70 border-b border-paper/10">
      <nav className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-900 text-lg tracking-tight text-paper">
          ACID<span className="text-magenta">MATH</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-paper/70 hover:text-acidgreen transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            aria-label={`Open cart, ${count} items`}
            className="relative font-mono text-xs uppercase tracking-widest border border-dashed border-paper/40 rounded-[3px] w-10 h-10 grid place-items-center hover:border-magenta hover:text-magenta transition-colors"
          >
            {count}
          </button>
          <button
            className="md:hidden text-paper"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={clsx(
          "md:hidden overflow-hidden transition-[max-height] duration-300 bg-void/95 border-b border-paper/10",
          mobileOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-5 py-4 font-mono text-sm uppercase tracking-widest">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-paper/80 border-b border-paper/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
