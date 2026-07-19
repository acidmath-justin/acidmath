"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-gradient-to-r from-magenta to-violet text-paper shadow-neon hover:shadow-[0_0_35px_rgba(255,46,154,0.8)] hover:scale-[1.02]",
  secondary:
    "border border-paper/30 text-paper hover:border-acidgreen hover:text-acidgreen hover:shadow-neon-green",
  ghost: "text-paper/70 hover:text-paper underline underline-offset-4",
};

const sizes = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-6 py-3 text-sm tracking-widest",
  lg: "px-8 py-4 text-base tracking-widest",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "font-mono uppercase rounded-full transition-all duration-300 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acidgreen",
        "disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
