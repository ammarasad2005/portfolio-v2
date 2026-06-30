/**
 * Capabilities / Skills — single source of truth.
 * Categorized and contextualized (not just a tag cloud).
 *
 * Each capability has a `note` explaining how it's used — this turns
 * a generic skills list into a credible engineering profile.
 */

export interface Capability {
  name: string;
  /** How/where I use it — concrete, not "experienced in" */
  note: string;
  /** 1-5 confidence — but NOT shown as self-rating. Used to weight visual hierarchy. */
  proficiency: 1 | 2 | 3 | 4 | 5;
}

export interface CapabilityGroup {
  /** Standard label (shown in nav) */
  label: string;
  /** Evocative subtitle (shown on the section) */
  subtitle: string;
  capabilities: Capability[];
}

export const capabilityGroups: CapabilityGroup[] = [
  {
    label: "Languages",
    subtitle: "Daily drivers and side quests",
    capabilities: [
      { name: "TypeScript", note: "Primary language across all 4 production projects", proficiency: 5 },
      { name: "JavaScript", note: "Chrome extension + legacy interop", proficiency: 5 },
      { name: "Python", note: "Scraping pipelines + AI parsing in CI/CD", proficiency: 4 },
      { name: "SQL", note: "PostgreSQL + Supabase query design", proficiency: 4 },
      { name: "C++", note: "Algo-Visualizer + competitive programming", proficiency: 3 },
    ],
  },
  {
    label: "Frontend",
    subtitle: "What the user actually touches",
    capabilities: [
      { name: "React 19", note: "Server components, suspense, transitions", proficiency: 5 },
      { name: "Next.js 16 (App Router)", note: "All shipped projects use App Router", proficiency: 5 },
      { name: "Tailwind CSS 4", note: "Design-system tokens, custom utilities", proficiency: 5 },
      { name: "Framer Motion", note: "Section-aware motion, reduced-motion fallbacks", proficiency: 4 },
      { name: "shadcn/ui", note: "Component composition over reinvention", proficiency: 4 },
    ],
  },
  {
    label: "Backend & APIs",
    subtitle: "Where the data lives and moves",
    capabilities: [
      { name: "Node.js + Express", note: "REST API design + OAuth serverless backends", proficiency: 4 },
      { name: "NextAuth", note: "Session management, provider integration", proficiency: 4 },
      { name: "REST APIs", note: "Schema-first contract design", proficiency: 5 },
      { name: "OAuth 2.0", note: "GCR Fetch — secret isolation via serverless", proficiency: 4 },
      { name: "Vercel Serverless", note: "Token exchange, cron triggers, edge functions", proficiency: 4 },
    ],
  },
  {
    label: "Databases",
    subtitle: "Where state persists",
    capabilities: [
      { name: "PostgreSQL (Supabase)", note: "Exam-Table, Drama-Ghar EPG, Hamara-Rozgar ledger", proficiency: 4 },
      { name: "MongoDB (Atlas)", note: "Drama-Ghar catalog + watch history", proficiency: 4 },
      { name: "Prisma", note: "Type-safe ORM for schema-first design", proficiency: 3 },
    ],
  },
  {
    label: "Tooling & Platforms",
    subtitle: "What ships the work",
    capabilities: [
      { name: "Git + GitHub Actions", note: "CI/CD pipelines with cron schedules", proficiency: 5 },
      { name: "Vercel", note: "Deployments, cron, serverless functions", proficiency: 5 },
      { name: "Chrome Extension MV3", note: "GCR Fetch — service worker + content scripts", proficiency: 4 },
      { name: "Linux", note: "Daily-driver dev environment", proficiency: 4 },
    ],
  },
  {
    label: "AI & Agents",
    subtitle: "Beyond the prompt box",
    capabilities: [
      { name: "Multi-agent LLM orchestration", note: "Hamara-Rozgar — 5 cooperative agents", proficiency: 4 },
      { name: "LLM failover chains", note: "Ollama → Groq → GitHub Models → regex", proficiency: 4 },
      { name: "Groq API", note: "Exam-Table CI parsing + Hamara-Rozgar", proficiency: 4 },
      { name: "Google Gemini", note: "Drama-Ghar content enrichment", proficiency: 3 },
      { name: "OSM Nominatim geocoding", note: "Hamara-Rozgar location resolution", proficiency: 3 },
    ],
  },
];
