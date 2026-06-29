import * as React from "react";
import { GraduationCap, Trophy, HeartHandshake, Award } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { timeline, type TimelineType } from "@/data/timeline";
import { sectionSubtitles } from "@/data/personal";

const typeMeta: Record<TimelineType, { icon: React.ElementType; label: string }> = {
  education: { icon: GraduationCap, label: "Education" },
  hackathon: { icon: Trophy, label: "Hackathon" },
  volunteer: { icon: HeartHandshake, label: "Volunteer" },
  achievement: { icon: Award, label: "Achievement" },
};

export function Timeline() {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="relative scroll-mt-24 py-24 sm:py-32 border-t border-border/40"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="04 — Timeline"
            title="Timeline"
            subtitle={sectionSubtitles.timeline}
            id="timeline-heading"
          />
        </Reveal>

        <div className="mt-16">
          <ol className="relative">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:-translate-x-1/2"
            />

            {timeline.map((entry, idx) => {
              const meta = typeMeta[entry.type];
              const Icon = meta.icon;
              const isLeft = idx % 2 === 0;

              return (
                <Reveal key={`${entry.title}-${entry.date}`} delay={idx * 0.05}>
                  <li
                    className={`relative pl-8 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 pb-12 last:pb-0 ${
                      isLeft ? "" : "sm:[direction:rtl]"
                    }`}
                  >
                    {/* Dot */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 sm:left-1/2 top-1.5 sm:-translate-x-1/2 z-10"
                    >
                      <span className="block h-3.5 w-3.5 rounded-full border-2 border-accent bg-background" />
                    </div>

                    {/* Card */}
                    <div
                      className={`sm:[direction:ltr] ${
                        isLeft ? "sm:col-start-1 sm:text-right" : "sm:col-start-2"
                      }`}
                    >
                      <div className="inline-block w-full p-5 rounded-xl border border-border/60 bg-card/40 backdrop-blur hover:border-border/80 transition-colors">
                        <div
                          className={`flex items-center gap-2 mb-2 ${
                            isLeft ? "sm:justify-end" : ""
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-accent" />
                          <span className="label-mono text-accent">
                            {meta.label}
                          </span>
                        </div>
                        <div
                          className={`flex items-baseline gap-3 mb-1 ${
                            isLeft ? "sm:justify-end sm:flex-row-reverse" : ""
                          }`}
                        >
                          <h3 className="text-lg font-medium text-foreground">
                            {entry.title}
                          </h3>
                        </div>
                        <p className="text-sm text-accent/90 font-medium mb-2">
                          {entry.org}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {entry.description}
                        </p>
                        <div
                          className={`flex flex-wrap items-center gap-2 text-xs text-muted-foreground ${
                            isLeft ? "sm:justify-end" : ""
                          }`}
                        >
                          <span className="label-mono tabular-nums">
                            {entry.date}
                          </span>
                          {entry.location && (
                            <>
                              <span className="text-border">·</span>
                              <span>{entry.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
