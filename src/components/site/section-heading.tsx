import * as React from "react";

interface SectionHeadingProps {
  /** Mono label, e.g. "02 — Work" */
  index?: string;
  /** Standard label (also shown in nav) */
  title: string;
  /** Evocative subtitle */
  subtitle?: string;
  /** Optional id for anchor navigation */
  id?: string;
  className?: string;
}

export function SectionHeading({
  index,
  title,
  subtitle,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4">
        {index && (
          <span className="label-mono text-accent/80 tabular-nums">{index}</span>
        )}
        <h2 className="display-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
      <div
        className="mt-6 h-px w-full bg-gradient-to-r from-border via-border/40 to-transparent"
        aria-hidden="true"
      />
      {className && <div className={className} />}
    </div>
  );
}
