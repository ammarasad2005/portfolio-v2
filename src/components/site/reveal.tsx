"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface RevealProps {
  children: React.ReactNode;
  /** Delay in seconds */
  delay?: number;
  /** Y offset to animate from */
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Reveal — scroll-triggered fade-up wrapper.
 * Respects prefers-reduced-motion (renders without animation).
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = usePrefersReducedMotion();

  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <MotionTag
      ref={ref as any}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
