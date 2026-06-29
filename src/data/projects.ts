/**
 * Project data — single source of truth.
 * Render projects from this data, never hardcode in JSX.
 *
 * Sources: GitHub analysis (RESEARCH-A) + resume.
 * Showcase order chosen for narrative: depth → breadth → agentic-AI → collaboration.
 */

export type ProjectStamp = "PRODUCTION" | "OPEN SOURCE" | "HACKATHON" | "CO-BUILT";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  /** URL-safe slug used for anchors */
  slug: string;
  /** Display name (kept authentic to repo / resume) */
  name: string;
  /** One-line pitch — vivid past-tense, measurable where possible */
  tagline: string;
  /** Longer paragraph (2-3 sentences) for the case-study body */
  description: string;
  /** What I personally built / owned (not the whole project) */
  contributions: string[];
  /** Concrete metrics */
  metrics: ProjectMetric[];
  /** Tech stack tags — recruiter-matchable */
  stack: string[];
  /** Links */
  liveUrl?: string;
  repoUrl: string;
  /** Year (for chronology) */
  year: string;
  /** Status stamps */
  stamps: ProjectStamp[];
  /** Accent hue for the card (oklch hue 0-360) */
  accentHue: number;
}

export const projects: Project[] = [
  {
    slug: "exam-table",
    name: "FAST Isb Utilities",
    tagline:
      "Consolidated 12+ campus tools — timetable, exam schedule, free-rooms finder, faculty directory, events, lost & found — into one deployed app used by FAST NUCES Islamabad students.",
    description:
      "A unified campus companion that replaced a dozen scattered student tools with a single typed-Next.js app. Data freshness is automated via Vercel Cron (hourly + weekly), with faculty, event, and room data persisted in Supabase PostgreSQL and consumed by typed server components. The scraping pipeline runs Python + Groq AI parsing on GitHub Actions and auto-commits structured JSON back to the repo.",
    contributions: [
      "Architected the 14-feature campus companion from solo concept to production",
      "Built hourly + weekly CI/CD cron pipelines on GitHub Actions with Python scraping + Groq AI parsing",
      "Modeled faculty, room, event, and timetable data in Supabase (PostgreSQL)",
      "Wrote 830-line README documenting architecture, data flow, and contribution guide",
    ],
    metrics: [
      { label: "Commits", value: "376+" },
      { label: "Features", value: "14" },
      { label: "Cron jobs", value: "Hourly + Weekly" },
      { label: "README", value: "830 lines" },
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Vercel Cron",
      "GitHub Actions",
      "Python",
      "Groq AI",
    ],
    liveUrl: "https://fast-nuces.vercel.app",
    repoUrl: "https://github.com/ammarasad2005/Exam-Table",
    year: "2026",
    stamps: ["PRODUCTION", "OPEN SOURCE"],
    accentHue: 65, // amber
  },
  {
    slug: "gcr-resources-fetch",
    name: "GCR Fetch",
    tagline:
      "Manifest V3 Chrome extension that bulk-downloads every Google Classroom resource as one organized ZIP — replacing 20–25 minutes of manual clicking per course.",
    description:
      "A cross-browser (Chrome + Firefox) Manifest V3 extension that uses hybrid DOM + REST API detection to enumerate every Classroom resource, then streams them as an organized ZIP. OAuth 2.0 token exchange is routed through a Vercel serverless backend so the client secret never touches the extension; API calls are restricted to an HTTPS-only Google-domain allowlist and filenames are sanitized defensively.",
    contributions: [
      "Designed Manifest V3 service worker with hybrid DOM + REST API resource detection",
      "Secured OAuth 2.0 via serverless Vercel backend — client secret never ships in the extension",
      "Hardened with HTTPS-only Google-domain allowlist + filename sanitization",
      "Added cross-browser support (Chrome MV3 + Firefox MV2 compatibility layer)",
    ],
    metrics: [
      { label: "Time saved / course", value: "20–25 min" },
      { label: "README", value: "324 lines" },
      { label: "Stars", value: "3" },
      { label: "Browsers", value: "Chrome + Firefox" },
    ],
    stack: [
      "Chrome Extension MV3",
      "OAuth 2.0",
      "Google Classroom API",
      "Vercel Serverless",
      "JavaScript",
      "JSZip",
    ],
    repoUrl: "https://github.com/ammarasad2005/gcr-resources-fetch",
    year: "2026",
    stamps: ["PRODUCTION", "OPEN SOURCE"],
    accentHue: 35, // copper-orange
  },
  {
    slug: "hamara-rozgar",
    name: "Hamara-Rozgar",
    tagline:
      "5-cooperative-agent LLM orchestrator for Pakistan's informal economy — multilingual parsing, OSM Nominatim geocoding, Supabase ledger, and a 6-factor utility function for agent coordination.",
    description:
      "Built at the Google Antigravity Community Hackathon (AISeekho 2026) with a team of five. The system routes natural-language job requests through five specialized agents (intake, parser, geocoder, ledger, dispatcher) with multi-LLM failover (Ollama → Groq → GitHub Models → regex fallback). A 6-factor utility function scores agent responses to pick the best output. Shipped as a Capacitor APK so micro-merchants could install it directly.",
    contributions: [
      "Designed 5-agent cooperative architecture with explicit Mermaid diagrams",
      "Implemented multi-LLM failover chain (Ollama → Groq → GitHub Models → regex)",
      "Wrote the 6-factor utility function scoring agent responses",
      "Integrated OSM Nominatim geocoding + Supabase ledger",
      "Shipped Capacitor APK for direct install",
    ],
    metrics: [
      { label: "Agents", value: "5 cooperative" },
      { label: "LLM failover", value: "4-tier" },
      { label: "Utility factors", value: "6" },
      { label: "Commits", value: "139" },
    ],
    stack: [
      "TypeScript",
      "Multi-agent LLM",
      "Ollama",
      "Groq",
      "GitHub Models",
      "Supabase",
      "OSM Nominatim",
      "Capacitor",
      "Mermaid",
    ],
    repoUrl: "https://github.com/ammarasad2005/hamara-rozgar",
    year: "2026",
    stamps: ["HACKATHON"],
    accentHue: 200, // teal
  },
  {
    slug: "drama-ghar",
    name: "DramaGhar",
    tagline:
      "Full-stack Pakistani drama tracking and streaming platform cataloguing 200+ dramas with embedded streaming, watch history, per-episode analytics, and a live Electronic Program Guide.",
    description:
      "Co-built with Hanzlah Ch. — a Next.js 15 + React 19 platform that catalogs 200+ Pakistani dramas with embedded streaming, per-episode analytics, watch history, and a live EPG grid backed by Supabase. Implemented role-based access control, bcrypt password encryption, JWT session management, and Google Gemini integration for content enrichment.",
    contributions: [
      "Implemented RBAC, bcrypt password encryption, and JWT session management",
      "Built live Electronic Program Guide (EPG) grid backed by Supabase",
      "Cataloged 200+ dramas with embedded streaming + per-episode analytics",
      "Integrated Google Gemini for content enrichment (co-built with Hanzlah Ch.)",
    ],
    metrics: [
      { label: "Dramas cataloged", value: "200+" },
      { label: "Stack", value: "Next.js 15 · React 19" },
      { label: "Auth", value: "RBAC + JWT + bcrypt" },
      { label: "AI", value: "Google Gemini" },
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "MongoDB Atlas",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion",
      "Google Gemini",
      "JWT",
      "bcrypt",
    ],
    liveUrl: "https://drama-ghar.vercel.app",
    repoUrl: "https://github.com/ammarasad2005/Drama-Ghar",
    year: "2026",
    stamps: ["PRODUCTION", "CO-BUILT"],
    accentHue: 305, // magenta
  },
];

/**
 * Engineering note case studies — separate from projects because they're
 * cross-cutting technical decisions worth surfacing in their own section.
 */
export interface EngineeringNote {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  /** Bullet points with the actual code/config snippets or takeaways */
  takeaways: string[];
  /** Related project slug */
  relatedProject?: string;
  accentHue: number;
}

export const engineeringNotes: EngineeringNote[] = [
  {
    slug: "security-headers",
    title: "Security headers as product decisions",
    subtitle: "WayFinder · next.config.ts",
    body:
      "Every header in WayFinder's next.config.ts has an inline rationale comment explaining the trade-off. Security isn't a checklist — it's a series of decisions about who you trust, what you allow, and what you trade for it. CSP restricts inline scripts even though it costs us a few console warnings; HSTS is pinned at two years because we expect long-lived sessions; Permissions-Policy locks down camera, microphone, and geolocation to the origins that actually need them.",
    takeaways: [
      "Content-Security-Policy with explicit source allowlist (no unsafe-inline)",
      "HSTS pinned at max-age=63072000 with includeSubDomains + preload",
      "Permissions-Policy denies camera, microphone, geolocation by default",
      "X-Frame-Options: DENY to prevent clickjacking",
      "Referrer-Policy: strict-origin-when-cross-origin",
    ],
    relatedProject: "exam-table",
    accentHue: 145,
  },
  {
    slug: "hourly-cron-pipeline",
    title: "Hourly CI/CD cron pipeline",
    subtitle: "Exam-Table · GitHub Actions + Vercel Cron",
    body:
      "Exam-Table's data freshness is automated end-to-end. A GitHub Actions workflow runs hourly, scrapes the FAST NUCES Islamabad timetable HTML with Python, parses it with Groq AI into structured JSON, validates the schema, and auto-commits the result back to the repo. Vercel Cron triggers a separate weekly pass for less-volatile data (faculty, rooms). The pipeline has its own secrets, its own failure notifications, and its own commit history — production discipline applied to a student project.",
    takeaways: [
      "Hourly GitHub Actions workflow: scrape → parse → validate → commit",
      "Groq AI for fuzzy HTML → structured JSON parsing",
      "Vercel Cron for weekly faculty/room data refresh",
      "Schema validation before commit (no malformed data ships)",
      "Dedicated secrets + failure-aware commit messages",
    ],
    relatedProject: "exam-table",
    accentHue: 65,
  },
  {
    slug: "multi-agent-llm",
    title: "Multi-agent LLM architecture",
    subtitle: "Hamara-Rozgar · 5-agent cooperative orchestrator",
    body:
      "Hamara-Rozgar routes natural-language job requests through five specialized agents: intake (normalizes input), parser (extracts intent + entities), geocoder (resolves locations via OSM Nominatim), ledger (writes to Supabase), and dispatcher (returns the response). Each agent has a 4-tier LLM failover chain (Ollama → Groq → GitHub Models → regex fallback) so the system degrades gracefully when a provider rate-limits. A 6-factor utility function scores each candidate response on relevance, completeness, latency, cost, safety, and confidence — the highest-scoring output wins.",
    takeaways: [
      "5 specialized agents with clear single-responsibility boundaries",
      "4-tier LLM failover: Ollama → Groq → GitHub Models → regex",
      "6-factor utility function: relevance, completeness, latency, cost, safety, confidence",
      "Explicit Mermaid architecture diagrams in the repo",
      "Capacitor APK for direct install on micro-merchant devices",
    ],
    relatedProject: "hamara-rozgar",
    accentHue: 200,
  },
];
