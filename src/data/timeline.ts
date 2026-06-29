/**
 * Timeline — single source of truth.
 * Education, hackathons, volunteer experience, achievements.
 */

export type TimelineType = "education" | "hackathon" | "volunteer" | "achievement";

export interface TimelineEntry {
  date: string;
  /** Short label */
  title: string;
  /** Org / context */
  org: string;
  /** 1-2 sentences */
  description: string;
  type: TimelineType;
  /** Optional location */
  location?: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: "2023 — 2027",
    title: "B.S. Computer Science",
    org: "FAST-NUCES Islamabad",
    description:
      "Currently in the 6th semester. Coursework spans algorithms, operating systems, databases, networks, and software engineering — applied directly to shipped production projects.",
    type: "education",
    location: "Islamabad, Pakistan",
  },
  {
    date: "2026",
    title: "Google Antigravity Community Hackathon — AISeekho",
    org: "Google for Developers + MoITT Pakistan",
    description:
      "Team of 5. Built Hamara-Rozgar — a 5-agent cooperative AI orchestrator for Pakistan's informal economy. Regional event with 2,668+ registrations and a PKR 2.5M prize pool.",
    type: "hackathon",
    location: "Islamabad",
  },
  {
    date: "Jan 2025",
    title: "National AI Hackathon",
    org: "atomcamp @ FAST-NUCES Islamabad",
    description:
      "Solo participation in a two-day national hackathon focused on agentic AI solutions. First exposure to multi-agent system design.",
    type: "hackathon",
    location: "Islamabad",
  },
  {
    date: "Winter 2025",
    title: "FAST Problem Solving Competition (FPSC)",
    org: "ACM NUCES",
    description:
      "Solo competitor in FAST-NUCES's inter-semester competitive programming challenge. Algorithms under time pressure.",
    type: "achievement",
    location: "Islamabad",
  },
  {
    date: "Sep 2024 — Dec 2024",
    title: "Volunteer Literacy Tutor",
    org: "Karwaan-e-Mudabbir",
    description:
      "16-hour community service engagement teaching basic literacy and mathematics to underprivileged students via a non-formal education program.",
    type: "volunteer",
    location: "Islamabad",
  },
];
