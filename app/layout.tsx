import type { Metadata } from "next";
import { Unbounded, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://acidmath.com"),
  title: "Acidmath — Blotter to Body",
  description:
    "Premium psychedelic apparel. Enlarged blotter grids printed on fabric, not paper. Made in the USA & Canada. Anti-censorship, always.",
  openGraph: {
    title: "Acidmath — Blotter to Body",
    description: "Wearable heresy. Enlarged blotter art on premium apparel.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="font-body bg-void text-paper antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
