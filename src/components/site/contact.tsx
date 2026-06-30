import * as React from "react";
import { Mail, Github, Linkedin, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import { personalInfo } from "@/data/personal";
import { sectionSubtitles } from "@/data/personal";

const contactLinks = [
  {
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    value: personalInfo.githubHandle,
    href: personalInfo.github,
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: personalInfo.linkedinHandle,
    href: personalInfo.linkedin,
    icon: Linkedin,
    external: true,
  },
  {
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone.replace(/\s/g, "")}`,
    icon: Phone,
    external: false,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 py-24 sm:py-32 border-t border-border/40"
    >
      <div className="container-prose">
        <Reveal>
          <SectionHeading
            index="06 — Contact"
            title="Contact"
            subtitle={sectionSubtitles.contact}
            id="contact-heading"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main CTA */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div>
              <p className="display-serif text-3xl sm:text-4xl text-foreground leading-tight mb-6">
                Let's build something{" "}
                <span className="text-accent">that ships.</span>
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-xl">
                I'm open to full-stack internship roles for Summer / Fall 2026,
                and always interested in side projects that need an extra pair
                of hands with production-grade instincts. The fastest way to
                reach me is email — I reply within a day.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a href={`mailto:${personalInfo.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Send an email</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border/80"
                >
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                </Button>
              </div>

              {/* Availability chip */}
              <div className="mt-10 inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-card/40 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm text-foreground">
                  {personalInfo.availability}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Contact links grid */}
          <Reveal className="lg:col-span-5" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 border border-border/40 rounded-xl overflow-hidden">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group bg-background/60 backdrop-blur p-5 hover:bg-card transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-5 w-5 text-accent" />
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="label-mono text-muted-foreground mb-1">
                      {link.label}
                    </div>
                    <div className="text-sm text-foreground font-medium truncate">
                      {link.value}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Location */}
            <div className="mt-4 p-5 rounded-xl border border-border/40 bg-background/40">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="label-mono text-muted-foreground">Based in</span>
              </div>
              <p className="text-sm text-foreground">
                {personalInfo.location}{" "}
                <span className="text-muted-foreground">· PKT (UTC+5)</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Open to remote / hybrid / on-site in Islamabad.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
