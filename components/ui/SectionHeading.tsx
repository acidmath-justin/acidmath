import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="font-mono text-xs tracking-[0.3em] text-acidgreen uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-6xl font-bold text-paper leading-[0.95] mb-4">
        {title}
      </h2>
      {description && (
        <p className="font-body text-paper/60 max-w-xl text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export function GlowText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "bg-gradient-to-r from-magenta via-violet to-acidgreen bg-clip-text text-transparent",
        "drop-shadow-[0_0_25px_rgba(255,46,154,0.35)]",
        className
      )}
    >
      {children}
    </span>
  );
}
