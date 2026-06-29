/**
 * Personal info — single source of truth for identity, contact, and stats.
 */

export const personalInfo = {
  name: "Muhammad Ammar Asad",
  /** Short signature used in nav, hero monogram, footer */
  shortName: "Ammar",
  /** Initials for the monogram avatar */
  initials: "aa",
  role: "Full-Stack Engineer",
  /** One-line value prop — concrete, no buzzwords */
  valueProp:
    "I build production web apps end-to-end — TypeScript, React, Next.js, Node.js — with the security, CI/CD, and ops discipline most students skip. CS undergrad at FAST-NUCES Islamabad, graduating 2027.",
  location: "Islamabad, Pakistan",
  email: "ammarasad321993@gmail.com",
  phone: "+92 333 1632861",
  github: "https://github.com/ammarasad2005",
  githubHandle: "ammarasad2005",
  linkedin: "https://linkedin.com/in/muhammad-ammar-asad",
  linkedinHandle: "muhammad-ammar-asad",
  availability: "Open to full-stack internship roles — Summer / Fall 2026",
  /** Stat chips for the hero */
  stats: [
    { label: "Production projects", value: "4" },
    { label: "Commits on flagship", value: "376+" },
    { label: "Hackathons", value: "2" },
    { label: "Based in", value: "Islamabad" },
  ],
} as const;

/** Navigation — single source of truth. Standard labels for recruiter/ATS clarity. */
export const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Timeline", href: "#timeline" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
] as const;

/** Section subtitles — evocative but standard labels stay in nav. */
export const sectionSubtitles = {
  about: "Current chapter",
  work: "Selected work — shipped, not theoretical",
  capabilities: "What I actually use day-to-day",
  timeline: "Education, hackathons, service",
  notes: "How I think about engineering",
  contact: "Get in touch",
} as const;
