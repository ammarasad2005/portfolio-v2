import * as React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { personalInfo, navItems } from "@/data/personal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="relative mt-auto border-t border-border/60 bg-background/60 backdrop-blur"
    >
      <div className="container-prose py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Identity */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="display-serif text-3xl text-accent"
                aria-hidden="true"
              >
                {personalInfo.initials}
              </span>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {personalInfo.name}
                </div>
                <div className="label-mono text-muted-foreground mt-0.5">
                  {personalInfo.role}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Built from scratch with Next.js 16, React 19, TypeScript, Tailwind
              CSS 4, three.js, and Framer Motion. No template, no shortcuts.
            </p>
          </div>

          {/* Nav */}
          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="label-mono text-muted-foreground mb-4">Navigate</h2>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline hover:link-underline-hover"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="md:col-span-4">
            <h2 className="label-mono text-muted-foreground mb-4">Connect</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <span className="link-underline group-hover:link-underline-hover">
                    {personalInfo.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5 text-accent" />
                  <span className="link-underline group-hover:link-underline-hover">
                    github.com/{personalInfo.githubHandle}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5 text-accent" />
                  <span className="link-underline group-hover:link-underline-hover">
                    linkedin.com/in/{personalInfo.linkedinHandle}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="label-mono">© {year} {personalInfo.shortName}</span>
            <span className="text-border">·</span>
            <span className="label-mono">Last updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="label-mono">Built with</span>
            <span className="text-foreground">Next.js 16 · React 19 · TS · three.js · Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
