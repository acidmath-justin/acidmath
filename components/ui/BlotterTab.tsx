"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type BlotterTabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  disabled?: boolean;
};

/**
 * The brand's signature element: every blotter sheet is perforated into
 * tabs. We reuse that literal shape as the interaction model for size /
 * variant selection — "tearing off" a tab selects it. Also used, unstyled,
 * as a plain badge (see Navbar cart count).
 */
export function BlotterTab({ label, active, disabled, className, ...props }: BlotterTabProps) {
  return (
    <button
      disabled={disabled}
      aria-pressed={active}
      className={clsx(
        "relative w-11 h-11 shrink-0 font-mono text-xs grid place-items-center border rounded-[3px]",
        "transition-all duration-150",
        active
          ? "border-solid border-acidgreen text-acidgreen shadow-neon-green animate-tear"
          : "border-dashed border-paper/40",
        !active && !disabled && "text-paper/70 hover:border-magenta hover:text-magenta",
        disabled && "opacity-30 line-through cursor-not-allowed",
        className
      )}
      {...props}
    >
      {label}
    </button>
  );
}

/** A row of perforation holes used as a section divider — the same motif, flattened. */
export function PerforatedDivider({ className }: { className?: string }) {
  return (
    <div
      className={clsx("h-px w-full bg-perf-grid bg-perf-16 opacity-60", className)}
      aria-hidden
    />
  );
}
