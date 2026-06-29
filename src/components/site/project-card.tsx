"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project, ProjectStamp } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const stampStyles: Record<ProjectStamp, string> = {
  PRODUCTION: "text-emerald-400/90 border-emerald-400/30",
  "OPEN SOURCE": "text-accent border-accent/30",
  HACKATHON: "text-sky-400/90 border-sky-400/30",
  "CO-BUILT": "text-purple-400/90 border-purple-400/30",
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const accentColor = `oklch(0.78 0.16 ${project.accentHue})`;
  const accentBg = `oklch(0.78 0.16 ${project.accentHue} / 0.08)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative scroll-mt-24"
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur",
          "transition-all duration-300",
          "hover:border-border hover:bg-card/60",
          "focus-within:border-border focus-within:bg-card/60"
        )}
      >
        {/* Accent strip */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px opacity-60 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        />

        {/* Stamps — top right, rotated */}
        <div className="absolute top-5 right-5 flex flex-col items-end gap-2 z-10">
          {project.stamps.map((stamp) => (
            <span
              key={stamp}
              className={cn(
                "label-mono px-2 py-0.5 border rounded-sm rotate-2",
                stampStyles[stamp]
              )}
            >
              {stamp}
            </span>
          ))}
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header row */}
          <div className="flex items-baseline gap-3 mb-4 pr-32">
            <span className="label-mono text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="label-mono text-muted-foreground inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            id={`${project.slug}-title`}
            className="display-serif text-3xl sm:text-4xl text-foreground leading-tight mb-3"
          >
            {project.name}
          </h3>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-4">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Contributions */}
          <div className="mb-6">
            <h4 className="label-mono text-accent mb-3">What I built</h4>
            <ul className="space-y-2">
              {project.contributions.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-foreground/90 leading-relaxed"
                >
                  <span
                    className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                    style={{ background: accentColor }}
                    aria-hidden="true"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <h4 className="label-mono text-accent mb-3">By the numbers</h4>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-background/60 px-3 py-3"
                  style={{ backgroundColor: accentBg }}
                >
                  <dd className="text-base sm:text-lg font-medium text-foreground tabular-nums">
                    {m.value}
                  </dd>
                  <dt className="label-mono text-muted-foreground mt-0.5">
                    {m.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Stack */}
          <div className="mb-6">
            <h4 className="label-mono text-accent mb-3">Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="font-mono text-[0.7rem] font-normal px-2 py-0.5 border-border/60 bg-background/40 text-muted-foreground"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40">
            {project.liveUrl && (
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-foreground hover:text-accent hover:bg-transparent px-0 mr-2"
              >
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5"
                >
                  <span className="text-sm font-medium link-underline group-hover/btn:link-underline-hover">
                    Live demo
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-accent hover:bg-transparent px-0"
            >
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm font-medium link-underline group-hover/btn:link-underline-hover">
                  Source
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Hover glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}08, transparent 40%)`,
          }}
        />
      </div>
    </motion.article>
  );
}
