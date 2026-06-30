import * as React from "react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { capabilityGroups } from "@/data/capabilities";
import { sectionSubtitles } from "@/data/personal";
import { cn } from "@/lib/utils";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative scroll-mt-24 py-24 sm:py-32 border-t border-border/40"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="03 — Capabilities"
            title="Capabilities"
            subtitle={sectionSubtitles.capabilities}
            id="capabilities-heading"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {capabilityGroups.map((group, gIdx) => (
            <Reveal key={group.label} delay={gIdx * 0.05}>
              <div>
                <div className="flex items-baseline justify-between mb-5">
                  <h3 className="display-serif text-2xl text-foreground">
                    {group.label}
                  </h3>
                  <span className="label-mono text-muted-foreground">
                    {String(gIdx + 1).padStart(2, "0")} / {String(capabilityGroups.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-5 italic">
                  {group.subtitle}
                </p>

                <ul className="space-y-3">
                  {group.capabilities.map((cap) => (
                    <li
                      key={cap.name}
                      className="group relative flex items-baseline gap-4 pb-3 border-b border-border/40"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base text-foreground font-medium">
                            {cap.name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {cap.note}
                        </p>
                      </div>
                      {/* Proficiency dots (subtle, not self-rating) */}
                      <div
                        className="flex items-center gap-1 shrink-0"
                        aria-hidden="true"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-1 w-1 rounded-full transition-colors",
                              i < cap.proficiency
                                ? "bg-accent"
                                : "bg-border"
                            )}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
