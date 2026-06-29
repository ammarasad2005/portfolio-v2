# Portfolio Build — Strategy & Synthesis
**Subject:** Muhammad Ammar Asad · `github.com/ammarasad2005`
**Status:** Build in progress

---

## 1. Personal Profile Analysis

Ammar is a **production-minded full-stack engineer** who happens to still be in school. The signal isn't "student who builds side projects" — it's "engineer who ships real systems used by real people, and is also completing a CS degree."

Three identity pillars emerge from the source material:

1. **Shipped, not theoretical.** Four deployed projects, automated CI/CD pipelines (hourly cron on Exam-Table), 200+ drama catalog live on Drama-Ghar, 12+ tools consolidated into one campus app. He ships to production.
2. **Security-aware full-stack.** OAuth 2.0 with serverless secret isolation (gcr-resources-fetch), CSP/HSTS/Permissions-Policy headers with inline rationale comments (WayFinder's `next.config.ts`), RBAC + bcrypt + JWT (Drama-Ghar). This is rare at his stage.
3. **Agentic AI maturity beyond buzzwords.** Hamara-Rozgar (5-cooperative-agent LLM marketplace with multi-LLM failover Ollama → Groq → GitHub Models → regex, 6-factor utility function, Mermaid architecture diagrams). Google Antigravity Hackathon pedigree. This is the narrative he should be leaning into for 2026 hiring.

Growth trajectory: 2024 (volunteer tutor) → Q1 2025 (first hackathon) → 2025 (Drama-Ghar v1) → early 2026 (Exam-Table flagship + GCR extension + WayFinder) → mid 2026 (multi-agent LLM at hackathon). The slope is steep and still rising.

---

## 2. GitHub Analysis (summary)

### Showcase Order (revised from research)

| # | Project | Why it leads |
|---|---------|--------------|
| 1 | **Exam-Table** (FAST Isb Utilities) | Flagship. 376 commits, 14 features, hourly cron CI/CD, real users at FAST NUCES Islamabad. Demonstrates depth + ops maturity. |
| 2 | **gcr-resources-fetch** | Chrome MV3 + Firefox cross-browser, OAuth 2.0 with serverless secret isolation, most stars (3). Demonstrates breadth beyond web. |
| 3 | **Hamara-Rozgar** *(hidden strength, not on resume)* | 5-agent cooperative LLM marketplace, multi-LLM failover, 6-factor utility function, hackathon pedigree, Capacitor APK. The agentic-AI story for 2026. |
| 4 | **Drama-Ghar** | Modern stack (Next.js 15 + React 19 + MongoDB + Supabase + Gemini), RBAC + bcrypt + JWT, co-built with Hanzlah Ch. Demonstrates collaboration + security + AI in one piece. |

### Hidden Strengths Worth Surfacing
- **WayFinder's `next.config.ts` security headers block** — the most security-mature code in his portfolio. Gets its own callout in "Engineering Notes."
- **Algo-Visualizer** ("EvoSearch Lab") — 18+ algorithms visualized (Genetic + Informed Search), CS-fundamentals depth, own CI/CD with ghcr.io.
- **Google Antigravity Community Hackathon** — Islamabad regional, 2,668+ registrations, PKR 2.5M prize pool, Google for Developers + MoITT Pakistan. Real citable credential.

### Gaps (de-emphasize, don't fabricate)
- WayFinder's README is unchanged `create-next-app` boilerplate. Don't feature it on the portfolio until fixed; the security headers story stands on its own.
- No tests in any repo. Don't claim testing maturity.
- 0–3 stars, 3 followers across all repos. Don't lead with social proof — lead with technical depth and shipped scope.
- ~11 repos have no README, ~5 are 1-commit placeholders. These stay off the portfolio entirely.

Full deep-dive (539 lines) is in `worklog.md` under `Task ID: RESEARCH-A`.

---

## 3. Portfolio Research Report (summary)

Six references reviewed. Full per-portfolio breakdowns in `worklog.md` under `RESEARCH-B` and `RESEARCH-C`.

### Patterns Worth Extracting
1. **Typed data files** (Matheus Almeida, AWRS) — render projects/skills/timeline from `src/data/*.ts`, not JSX. Version-controlled, no CMS overhead.
2. **Vivid past-tense project copy with measurables** (Jatin, AWRS) — "Reverse-engineered YouTube's metadata pipeline without triggering rate-limits" beats "Built a platform that…"
3. **Three-token color discipline** (Matheus) — `background / foreground / action` only. Resist semantic color sprawl.
4. **Single-font with full weight range** (Matheus) — hierarchy via weight, not typeface count. We're adding one display serif for personality.
5. **ScrollSpy + spring-animated nav underline** (Matheus) — `IntersectionObserver` + `motion.div` spring (stiffness 300, damping 30).
6. **Section subtitles with standard nav labels** (Jatin) — evocative subtitle ("Field Notes"), standard label in nav ("Experience"). Recruiter/ATS-friendly.
7. **Subtle SVG `feTurbulence` paper-grain overlay** (Jatin) — ~0KB, adds depth.
8. **"SHIPPED" / "PRODUCTION" stamps** on project cards (Jatin-inspired) — small rotated stamps, not gimmicky.

### Anti-Patterns to Avoid
1. **Click-to-enter loading gates** — recruiters bounce.
2. **3D that decorates instead of informs** — if 3D ships, make it section-aware.
3. **Custom cursors** — breaks native behavior, accessibility regression.
4. **Metaphor obscuring standard labels in nav** — recruiter-hostile.
5. **Self-rating projects 1–10** — reads as insecure.
6. **Clichéd dev humor** ("TURNING COFFEE INTO CODE") — tonal whiplash against disciplined design.

### Verdict on the 3D Inspiration (Aabaad-al-Aziz portfolio)
**Keep the stack, modify the architecture, drop the literal content.**
- **Keep:** R3F + drei + postprocessing; fixed-canvas + HTML overlay architecture; graceful mobile fallback *idea*.
- **Modify:** Migrate to Next.js 16 App Router with `dynamic(() => import(...), { ssr: false })`; make the 3D **section-aware** (responds to active section via scroll progress); ship a real mobile 3D scene (lower-poly, no postprocessing, `frameloop="demand"`, DPR ≤ 1.5).
- **Drop:** click-to-enter loader, duplicated nav text, the chess game (derivative).

---

## 4. Design Strategy

### Audience & Recruiter Journey
- **Primary:** Engineering recruiters and hiring managers at product companies (Mid-junior full-stack roles, internship → full-time conversion).
- **Secondary:** Senior engineers doing technical screens — they'll skim the project architecture and code patterns.
- **Tertiary:** Fellow devs, hackathon organizers, OSS maintainers.

**Recruiter journey (30-second target):**
1. **0–3s (Hero):** Name, role, one-line value prop, 3D scene, 3 stat chips. "Who is this person?"
2. **3–10s (About):** Narrative paragraph + current focus. "What's their story?"
3. **10–25s (Selected Work):** 4 project cards with measurable outcomes + tech tags. "What have they shipped?"
4. **25–30s (Capabilities + Contact):** Quick scan of stack, then a clear CTA. "How do I reach them?"

### Visual Direction
- **Default mode:** Dark, warm-neutral near-black (not pure `#000`). Premium, dev-credible, lets the 3D scene breathe.
- **Light mode:** Available via toggle. Warm off-white, same accent.
- **Signature accent:** Warm amber/copper (`oklch(0.74 0.16 60)`). Distinctive (most dev portfolios use blue/purple), pairs naturally with the cool 3D scene (warm subject against cool environment), evokes craftsmanship.
- **Typography:**
  - Display (hero name, section titles): **Instrument Serif** italic — editorial, premium, breaks the "AI-generated sans-only" feel.
  - Body & UI: **Geist Sans** — already in project, excellent at small sizes.
  - Mono (labels, data, terminal-style accents): **Geist Mono**.
- **Texture:** Subtle SVG `feTurbulence` noise overlay at 4% opacity for paper-grain depth.

### Information Architecture (single-page, anchor nav)
1. **Hero** — name, role, value prop, 3D scene, stat chips (commits, projects, hackathons)
2. **About** — narrative paragraph, current focus, what I'm exploring
3. **Selected Work** — 4 project case studies (Exam-Table, gcr-resources-fetch, Hamara-Rozgar, Drama-Ghar) with metrics, tech tags, live + repo links
4. **Capabilities** — categorized: Languages / Frontend / Backend & APIs / Databases / Tooling & Platforms / AI & Agents
5. **Timeline** — education, hackathons, volunteer, achievements
6. **Engineering Notes** — three short case studies: (a) Security headers as product decisions, (b) Hourly CI/CD cron pipeline, (c) Multi-agent LLM architecture
7. **Contact** — email, GitHub, LinkedIn, location, availability status
8. **Footer** — colophon, last updated, built-with

### Interaction Philosophy
- **Motion is meaning.** Every animation reveals information (active section, scroll progress, hover affordance). No decorative motion.
- **3D is section-aware.** The hero 3D scene subtly shifts hue/rotation as the user scrolls into each new section.
- **Reduced-motion respected.** `prefers-reduced-motion: reduce` disables 3D rotation and scroll-triggered animations.
- **Mobile-first.** 3D scene degrades to a lower-poly version; nav collapses to a sheet; touch targets ≥44px.

### Branding Direction
- **Voice:** Confident, specific, restrained. Vivid past-tense verbs + concrete measurables. No buzzwords ("passionate," "rockstar," "ninja").
- **Stamps:** Small rotated stamps on project cards ("PRODUCTION", "OPEN SOURCE", "HACKATHON") — borrowed from Jatin's case-file aesthetic, but minimal.
- **Naming:** Project names are kept as-is from the repos (Exam-Table, gcr-resources-fetch, Hamara-Rozgar, Drama-Ghar) — authentic, searchable.

---

## 5. Clarification Questions

I'm proceeding autonomously based on the resume, GitHub analysis, and portfolio research. The following are minor decisions I've made to avoid blocking — easy to revise later:

| Decision | Default chosen | Reasoning |
|----------|----------------|-----------|
| Default theme mode | **Dark** | Premium feel, lets 3D pop; light mode available via toggle. |
| Accent color | **Warm amber/copper** | Distinctive (no blue/purple), culturally warm, pairs with 3D. |
| Display font | **Instrument Serif italic** | Editorial personality, breaks AI-generated feel. |
| Which 4 projects to feature | Exam-Table, gcr-resources-fetch, Hamara-Rozgar, Drama-Ghar | Strongest combination of depth, breadth, agentic-AI narrative, and modern stack. WayFinder is referenced in Engineering Notes (security headers) instead. |
| Hero stats | 4 deployed projects · 376+ commits on flagship · 2 hackathons · Pakistan | Concrete, verifiable from GitHub/resume. |
| Personal photo | **Omitted** (use monogram/avatar instead) | No photo provided in uploads; monogram is cleaner. Easy to add later. |
| Contact form | **Direct email + LinkedIn links** (no form) | Form needs backend; mailto: + links is more reliable and faster. |

If any of these are wrong, tell me and I'll adjust. Otherwise I'm proceeding to build.

---

## 6. Final Build Plan

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5 (non-negotiable, already in project)
- **Styling:** Tailwind CSS 4 + shadcn/ui (already in project)
- **3D:** three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **Motion:** Framer Motion (already in project)
- **Theme:** next-themes (already in project)
- **Icons:** lucide-react (already in project)
- **Fonts:** Geist Sans + Geist Mono (already in project) + Instrument Serif (Google Fonts)

### Architecture
```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata, theme provider
│   ├── page.tsx          # assembles all sections
│   └── globals.css       # design tokens (color, type, motion)
├── components/
│   ├── site/             # portfolio-specific components
│   │   ├── nav.tsx
│   │   ├── hero.tsx
│   │   ├── scene-3d.tsx       # R3F canvas (client-only, dynamic import)
│   │   ├── about.tsx
│   │   ├── projects.tsx
│   │   ├── project-card.tsx
│   │   ├── capabilities.tsx
│   │   ├── timeline.tsx
│   │   ├── engineering-notes.tsx
│   │   ├── contact.tsx
│   │   ├── footer.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── section-heading.tsx
│   │   ├── reveal.tsx         # scroll-reveal wrapper
│   │   └── noise-overlay.tsx
│   └── ui/              # shadcn/ui (existing)
├── data/
│   ├── projects.ts      # typed project data
│   ├── capabilities.ts  # typed skills data
│   └── timeline.ts      # typed timeline data
└── hooks/
    ├── use-active-section.ts
    └── use-prefers-reduced-motion.ts
```

### Milestones
1. **Design tokens & fonts** — `globals.css` rewrite, layout.tsx fonts/metadata
2. **Data files** — typed `projects.ts`, `capabilities.ts`, `timeline.ts`
3. **3D scene** — `scene-3d.tsx` (R3F canvas with section-aware behavior)
4. **Core sections** — nav, hero (with 3D), about, projects, capabilities, timeline, engineering-notes, contact, footer
5. **Motion & a11y** — scroll reveals, scrollspy nav, reduced-motion fallbacks, keyboard nav
6. **SEO** — metadata, JSON-LD Person schema, OpenGraph, sitemap
7. **Self-critique & iterate** — review from 9 specialist perspectives, fix issues
8. **Browser verification** — Agent Browser end-to-end check

### Performance Targets
- Lighthouse 95+ on Performance / Accessibility / Best Practices / SEO
- 3D scene code-split (dynamic import, ssr: false), `frameloop="demand"` where possible
- Images: Next.js `<Image>` with `priority` only on hero
- Fonts: `display: swap`, preconnect to Google Fonts
- Bundle: keep first-load JS under 300KB (3D loads on demand after hydration)

---

## 7. Production Implementation

**Status:** Build in progress. See the live preview once complete.

The implementation is being executed in parallel with this document. Each section is built to production quality before moving to the next, then critiqued from the perspectives of: Senior Frontend Engineer, Staff Software Engineer, UX Designer, UI Designer, Recruiter, Hiring Manager, Accessibility Specialist, Performance Engineer, SEO Specialist, Product Designer.
