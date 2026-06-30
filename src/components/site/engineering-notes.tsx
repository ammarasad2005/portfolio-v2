import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { engineeringNotes } from "@/data/projects";
import { sectionSubtitles } from "@/data/personal";

export function EngineeringNotes() {
  return (
    <section
      id="notes"
      aria-labelledby="notes-heading"
      className="relative scroll-mt-24 py-24 sm:py-32 border-t border-border/40"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="05 — Notes"
            title="Engineering notes"
            subtitle={sectionSubtitles.notes}
            id="notes-heading"
          />
        </Reveal>

        <div className="mt-16 space-y-6">
          {engineeringNotes.map((note, idx) => {
            const accentColor = `oklch(0.78 0.16 ${note.accentHue})`;
            return (
              <Reveal key={note.slug} delay={idx * 0.05}>
                <article
                  id={note.slug}
                  className="group relative scroll-mt-24 overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur hover:border-border/80 transition-colors"
                >
                  {/* Accent left border */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: accentColor }}
                  />

                  <div className="p-6 sm:p-8 lg:p-10 pl-7 sm:pl-9 lg:pl-11">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="label-mono text-muted-foreground tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="label-mono text-accent">{note.subtitle}</span>
                    </div>

                    <h3 className="display-serif text-2xl sm:text-3xl text-foreground leading-tight mb-4">
                      {note.title}
                    </h3>

                    <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                      {note.body}
                    </p>

                    <div className="mb-4">
                      <h4 className="label-mono text-accent mb-3">Takeaways</h4>
                      <ul className="space-y-2">
                        {note.takeaways.map((t, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-foreground/90 font-mono"
                          >
                            <span
                              className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                              style={{ background: accentColor }}
                              aria-hidden="true"
                            />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {note.relatedProject && (
                      <a
                        href={`#${note.relatedProject}`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors group/link"
                      >
                        <span className="link-underline group-hover/link:link-underline-hover">
                          See related project
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
