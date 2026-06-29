export type ExperienceType =
  | "full-time"
  | "part-time"
  | "freelancer"
  | "intern"
  | "volunteer";

export interface ExperienceInterface {
  name: string;
  logo: string;
  role: string;
  type: ExperienceType;
  description: string | null;
  achievements: Array<string>;
  start: string;
  end: string | null;
  src: string | null;
  alt: string | null;
}

export const experiences: ExperienceInterface[] = [
  {
    name: "MelhorPreço.app",
    logo: "/work/melhorprecoapp.png",
    role: "FrontEnd Engineer",
    type: "full-time",
    description: null,
    achievements: [],
    start: "01/03/2026",
    end: null,
    src: null,
    alt: null,
  },
  {
    name: "Convenia",
    logo: "/work/convenia.png",
    role: "Front-End Developer",
    type: "full-time",
    description:
      "Supported the evolution of the HR platform by maintaining core features, resolving technical debt, and modernizing the front-end architecture through Vue.js upgrades and AI-assisted development.",
    achievements: [
      "Migrated legacy components from Vue 2 to Vue 3, improving maintainability and long-term scalability",
      "Used AI-assisted workflows to accelerate component updates and development tasks",
      "Acted in product sustainment, resolving production issues and handling support tickets",
      "Fixed critical bugs and improved overall system reliability",
      "Addressed technical debt to stabilize the codebase and improve development velocity",
    ],
    start: "01/12/2025",
    end: "01/03/2026",
    src: null,
    alt: null,
  },
  {
    name: "MelhorPreço.app",
    logo: "/work/melhorprecoapp.png",
    role: "FrontEnd Engineer",
    type: "full-time",
    description:
      "Evolved the shared lists app, focusing on usability, performance, and overall system stability.",
    achievements: [
      "Improved navigation efficiency and smoother app performance",
      "Enhanced user experience, with more intuitive and visually consistent interaction",
      "Boosted stability and responsiveness, reducing network overhead",
      "Strengthened collaboration among users through the new shared lists features",
      "Implemented cache-control headers on the backend to reduce API response time and enhance performance",
    ],
    start: "01/04/2025",
    end: "01/12/2025",
    src: null,
    alt: null,
  },
  {
    name: "Blip",
    logo: "/work/blip.svg",
    role: "Software Engineer",
    type: "full-time",
    description:
      "Revamped a complex legacy system to boost performance, scalability, and client efficiency through code cleanup, tech migration, security improvements, and AI integration.",
    achievements: [
      "Removed 20+ outdated feature flags, simplifying the codebase",
      "Introduced generative AI features, reducing manual client work by up to 60%",
      "Migrated critical routes from Python 2 to Python 3, ensuring long-term stability",
      "Refactored legacy components into Vue.js, resolving memory leaks and improving load times",
      "Implemented XSS mitigation by blocking malicious scripts, protecting users and improving system security.",
    ],
    start: "01/01/2023",
    end: "01/04/2025",
    src: "/work/blip-meet-up.jfif",
    alt: "Blip meet up",
  },
  {
    name: "Stilingue",
    logo: "/work/stilingue.svg",
    role: "Junior Front-End Developer",
    type: "full-time",
    description:
      "Improved dashboard usability and delivery speed by building dynamic filters, automating real-time updates, and developing modular components.",
    achievements: [
      "Developed 70+ reusable components in a single quarter",
      "Built global filters that cut setup time by up to 80%",
      "Created a component builder to increase product flexibility",
      "Improved Firebase security rules and optimized data structure",
      "Strengthened the design system with test coverage and documentation",
    ],
    start: "01/02/2022",
    end: "01/01/2023",
    src: "/work/stilingue-off-site.jfif",
    alt: "Stilingue Off Site",
  },
  {
    name: "Stilingue",
    logo: "/work/stilingue.svg",
    role: "Assistant Front-End Developer",
    type: "full-time",
    description:
      "Contributed to scalable product development by designing advanced Vue.js components, improving Firebase access control, and supporting a consistent, accessible design system.",
    achievements: [
      "Built components that enhanced data visualization and reusability",
      "Managed Firebase permissions and improved security practices",
      "Increased test coverage, reducing production bugs",
      "Contributed to the evolution of a reusable design system",
      "Accelerated feature delivery through modular, maintainable code",
    ],
    start: "01/06/2021",
    end: "01/02/2022",
    src: "/work/stilingue-assistant.jpeg",
    alt: "Stilingue Off Site",
  },
  {
    name: "Stilingue",
    logo: "/work/stilingue.svg",
    role: "Developer Intern",
    type: "intern",
    description:
      "Laid the groundwork for scalable front-end development by applying Vue.js principles to build maintainable components and improve code quality.",
    achievements: [
      "Created modular Vue.js components focused on reusability and clarity",
      "Applied lifecycle methods and reactivity to improve interactivity",
      "Structured the codebase for maintainability and collaboration",
      "Contributed to improving code quality and consistency",
      "Gained hands-on experience in front-end development within a fast-paced team",
    ],
    start: "01/09/2020",
    end: "01/06/2021",
    src: "/work/stilingue-intern.jpeg",
    alt: "Stilingue Off Site",
  },
];
