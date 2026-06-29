"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalInfo } from "@/data/personal";
import { useActiveSection } from "@/hooks/use-active-section";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

// 3D scene — client-only, code-split
const Scene3D = dynamic(() => import("./scene-3d"), {
  ssr: false,
  loading: () => null,
});

const ALL_SECTION_IDS = ["hero", "about", "work", "capabilities", "timeline", "notes", "contact"];

export function Hero() {
  const activeSection = useActiveSection(ALL_SECTION_IDS);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
      aria-label="Introduction"
    >
      {/* 3D canvas — fixed background, behind content */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {!reduced && (
          <Scene3D
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            isMobile={isMobile}
          />
        )}
        {/* Gradient mask for legibility — stronger in light mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background dark:from-background/30 dark:via-background/50 dark:to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-background/50 dark:from-background/80 dark:via-transparent dark:to-background/40" />
      </div>

      {/* Content overlay */}
      <div className="container-prose relative z-10 pt-24 pb-16">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Status line */}
          <div className="flex items-center gap-3 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="label-mono text-muted-foreground">
              {personalInfo.availability}
            </span>
          </div>

          {/* Name */}
          <h1 className="display-serif text-[clamp(3.5rem,12vw,9rem)] leading-[0.95] text-foreground">
            {personalInfo.name.split(" ").map((word, i) => (
              <span key={i} className="block">
                {i === 0 && <span className="text-accent">M. </span>}
                {i === 1 && word}
                {i === 2 && (
                  <>
                    {" "}
                    <span className="text-foreground/70">{word}</span>
                  </>
                )}
              </span>
            ))}
          </h1>

          {/* Role + value prop */}
          <div className="mt-8 space-y-5">
            <p className="text-xl sm:text-2xl text-foreground font-medium tracking-tight">
              {personalInfo.role}{" "}
              <span className="text-muted-foreground">·</span>{" "}
              <span className="text-muted-foreground">CS undergrad, FAST-NUCES Islamabad</span>
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {personalInfo.valueProp}
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="#work">
                <span className="text-sm font-medium">View selected work</span>
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-border/80 bg-background/40 backdrop-blur">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full">
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </Button>
          </div>

          {/* Stat chips */}
          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-xl overflow-hidden">
            {personalInfo.stats.map((stat) => (
              <div key={stat.label} className="bg-background/60 backdrop-blur px-4 py-4">
                <dd className="text-2xl font-medium text-foreground tabular-nums">
                  {stat.value}
                </dd>
                <dt className="label-mono text-muted-foreground mt-1">{stat.label}</dt>
              </div>
            ))}
          </dl>

          {/* Location */}
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{personalInfo.location}</span>
            <span className="mx-2 text-border">·</span>
            <span className="label-mono">PKT — UTC+5</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        initial={reduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="label-mono text-muted-foreground">Scroll</span>
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
