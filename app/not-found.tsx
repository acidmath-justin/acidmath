import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-32 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-acidgreen mb-4">
        Batch Not Found
      </p>
      <h1 className="font-display text-5xl md:text-7xl font-900 mb-6">404</h1>
      <p className="font-body text-paper/60 max-w-md mb-10">
        This tab tore off the sheet a while ago. Whatever you were looking
        for isn&apos;t here anymore.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/">
          <Button>Back To The Shop</Button>
        </Link>
        <Link href="/collections">
          <Button variant="secondary">View Collections</Button>
        </Link>
      </div>
    </div>
  );
}
