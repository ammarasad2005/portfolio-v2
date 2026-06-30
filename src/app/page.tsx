"use client";

import * as React from "react";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Projects } from "@/components/site/projects";
import { Capabilities } from "@/components/site/capabilities";
import { Timeline } from "@/components/site/timeline";
import { EngineeringNotes } from "@/components/site/engineering-notes";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { NoiseOverlay } from "@/components/site/noise-overlay";
import { StartupLoader } from "@/components/site/startup-loader";

const LOADER_KEY = "portfolio-loader-seen-v1";

export default function Home() {
  const [showLoader, setShowLoader] = React.useState(false);

  // Decide whether to show the loader (only on first visit per session)
  React.useEffect(() => {
    try {
      const seen = sessionStorage.getItem(LOADER_KEY);
      if (!seen) {
        setShowLoader(true);
      }
    } catch {
      // sessionStorage might be unavailable (private mode) — skip loader
    }
  }, []);

  const handleLoaderComplete = React.useCallback(() => {
    setShowLoader(false);
    try {
      sessionStorage.setItem(LOADER_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      {showLoader && <StartupLoader onComplete={handleLoaderComplete} />}
      <NoiseOverlay />
      <Nav />
      <main className="relative min-h-screen flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Capabilities />
        <Timeline />
        <EngineeringNotes />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
