import * as React from "react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { projects } from "@/data/projects";
import { sectionSubtitles } from "@/data/personal";

export function Projects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative scroll-mt-24 py-24 sm:py-32 border-t border-border/40"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="02 — Work"
            title="Selected work"
            subtitle={sectionSubtitles.work}
            id="work-heading"
          />
        </Reveal>

        <div className="mt-16 space-y-8">
          {projects.map((project, idx) => (
            <ProjectCard key={project.slug} project={project} index={idx} />
          ))}
        </div>

        {/* Footer note */}
        <Reveal delay={0.1}>
          <p className="mt-12 text-sm text-muted-foreground text-center">
            More on{" "}
            <a
              href="https://github.com/ammarasad2005"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:link-underline-hover text-foreground"
            >
              GitHub
            </a>
            . Pinned repos there may differ from this curated list — these are
            the four I'd put in front of a hiring manager today.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
