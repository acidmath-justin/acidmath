"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-32 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-magenta mb-4">Bad Batch</p>
      <h1 className="font-display text-3xl md:text-5xl font-900 mb-6">Something Tore</h1>
      <p className="font-body text-paper/60 max-w-md mb-10">
        That page hit a snag on our end. Try again, or head back to the shop.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => reset()}>Try Again</Button>
        <Link href="/">
          <Button variant="secondary">Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
