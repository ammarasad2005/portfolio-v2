import * as React from "react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { sectionSubtitles } from "@/data/personal";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="01 — About"
            title="About"
            subtitle={sectionSubtitles.about}
            id="about-heading"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main narrative */}
          <Reveal className="lg:col-span-8 space-y-6" delay={0.1}>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              I'm a full-stack engineer who happens to still be in school. The
              distinction matters: I don't build demos for assignments — I ship
              production systems with{" "}
              <span className="text-accent">CI/CD pipelines, security headers,
              and real users</span>. The school part is a parallel track that
              keeps my fundamentals sharp while I work on the next thing.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              My four shipped projects this year span a campus companion app
              used by FAST NUCES students (Exam-Table, 376+ commits), a
              Manifest V3 Chrome extension with OAuth-secured serverless
              backend (GCR Fetch), a 5-agent cooperative LLM orchestrator
              built at the Google Antigravity Hackathon (Hamara-Rozgar), and
              a 200+ drama catalog platform with RBAC and EPG (DramaGhar).
              Each one taught me a different muscle: ops discipline, security
              thinking, agentic system design, and collaborative full-stack
              delivery.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              The pattern I notice in my own work: I get interested in a real
              problem someone is having, build the smallest version that
              solves it, then keep adding infrastructure (cron, CI/CD,
              security headers, multi-LLM failover) until it behaves like
              something a small team would have shipped. That instinct — to
              treat every project as if it has to survive contact with real
              users — is what I'm bringing to my next role.
            </p>
          </Reveal>

          {/* Side rail — current focus */}
          <Reveal className="lg:col-span-4" delay={0.2}>
            <aside
              className="sticky top-24 space-y-8 p-6 rounded-xl border border-border/60 bg-card/40 backdrop-blur"
              aria-label="Current focus"
            >
              <div>
                <h3 className="label-mono text-accent mb-3">Current chapter</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  6th-semester CS undergrad at FAST-NUCES Islamabad.
                  Graduating 2027, seeking a full-stack internship for
                  Summer / Fall 2026.
                </p>
              </div>

              <div>
                <h3 className="label-mono text-accent mb-3">Exploring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>Multi-agent LLM orchestration patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>Edge runtime + serverless composition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>Chrome Extension MV3 patterns at scale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>Postgres row-level security + RBAC design</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="label-mono text-accent mb-3">Off-screen</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Competitive programming (FPSC), volunteer literacy tutoring
                  (Karwaan-e-Mudabbir), and a habit of rewriting my own READMEs
                  until they read like documentation.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
