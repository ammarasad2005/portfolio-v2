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

export default function Home() {
  return (
    <>
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
