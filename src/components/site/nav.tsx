"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { navItems, personalInfo } from "@/data/personal";
import { useActiveSection } from "@/hooks/use-active-section";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const sectionIds = navItems.map((item) => item.href.replace("#", ""));

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeId = useActiveSection(sectionIds);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="container-prose flex h-16 items-center justify-between gap-4"
        aria-label="Primary"
      >
        {/* Monogram */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          aria-label={`${personalInfo.name} — home`}
        >
          <span
            className="display-serif text-2xl text-accent leading-none"
            aria-hidden="true"
          >
            {personalInfo.initials}
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-medium text-foreground">
              {personalInfo.shortName}
            </span>
            <span className="label-mono text-muted-foreground mt-0.5">
              {personalInfo.role}
            </span>
          </span>
        </a>

        {/* Desktop nav — with scrollspy underline */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-current={isActive ? "true" : undefined}
              >
                <span className={isActive ? "text-foreground" : ""}>{item.label}</span>
                {!reduced && isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {reduced && isActive && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-px bg-accent" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
          >
            <a href={`mailto:${personalInfo.email}`}>
              <span className="label-mono">Contact</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
          <ThemeToggle />

          {/* Mobile nav trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full border border-border/60"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background border-l border-border">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex flex-col h-full pt-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="display-serif text-2xl text-accent">
                    {personalInfo.initials}
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {navItems.map((item, idx) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        className="group flex items-baseline gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="label-mono text-accent/70 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-lg text-foreground group-hover:text-accent transition-colors">
                          {item.label}
                        </span>
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-border">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="block px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub · {personalInfo.githubHandle}
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn · {personalInfo.linkedinHandle}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
