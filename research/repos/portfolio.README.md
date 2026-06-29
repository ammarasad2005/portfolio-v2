# Portfolio — Muhammad Ammar Asad

> A 3D observatory of projects. Full-stack web · Agentic AI · Mobile.

A personal portfolio built as a "who am I" site — not a recruitment document. The visitor arrives at a quiet observatory floating in deep navy space, scrolls to aim a telescope, and discovers projects as celestial bodies.

**Live:** Deploying to Vercel · **Source:** [github.com/ammarasad2005/portfolio](https://github.com/ammarasad2005/portfolio)

---

## What this is

A 3D, scroll-driven portfolio experience built with Next.js 16, React Three Fiber, and Three.js. The observatory concept isn't decoration — it's the structural metaphor: the visitor is the observer, the telescope is the viewport, each project is a celestial body discovered by aiming.

The portfolio expresses a full person, not just a skills matrix: code (7 shipped projects), voice (personality section with music + writing + the "why AI?" moment), community (literacy tutoring), and curiosity (what I want to understand next).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| 3D engine | Three.js + React Three Fiber + Drei |
| Animation | GSAP (scroll-linked camera) + Framer Motion (UI) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Fonts | Fraunces (display serif) + Inter (body) + JetBrains Mono (technical) |
| State | Zustand (scroll progress, current beat, sound toggle) |
| Icons | lucide-react |

## Quick start

```bash
bun install        # or: npm install / pnpm install
bun run dev        # or: npm run dev / pnpm dev
# Open http://localhost:3000
```

No environment variables required. No backend, no database, no API keys.

## Structure

```
src/
├── app/
│   ├── layout.tsx              # Fonts + metadata
│   ├── page.tsx                # Main scroll container (8 beats)
│   └── globals.css             # Design tokens + dark theme
│
├── components/
│   ├── three/                  # 3D scene
│   │   ├── scene.tsx                      # Root <Canvas>
│   │   ├── camera-rig.tsx                 # Scroll-linked camera
│   │   ├── starfield.tsx                  # 300 twinkling stars
│   │   ├── nebula-background.tsx          # Gradient shader sphere
│   │   ├── project-bodies.tsx             # 7 project celestial bodies
│   │   ├── projects/                      # One per project:
│   │   │   ├── exam-table-planet.tsx              # Planet + ring
│   │   │   ├── drama-ghar-binary-planet.tsx       # Binary planets
│   │   │   ├── hamara-rozgar-nebula.tsx           # 5000-particle nebula
│   │   │   ├── glucoguard-star.tsx                # 4-pulse star
│   │   │   ├── internship-finder-satellite.tsx    # Blinking satellite
│   │   │   ├── gcr-fetch-comet.tsx                # Comet + trail
│   │   │   └── wayfinder-speck.tsx                # Distant speck
│   │   └── observatory/                   # Observatory structures:
│   │       ├── telescope.tsx                      # Procedural refracting telescope
│   │       └── dome.tsx                           # 8-panel articulated dome
│   │
│   ├── dom/                    # DOM overlays (text + UI)
│   │   ├── loading-screen.tsx            # "Calibrating telescope" sequence
│   │   ├── hero-text.tsx                 # Beat 1 hero
│   │   ├── intro-panel.tsx               # Beat 2 introduction
│   │   ├── exploration-cues.tsx          # Beat 3 how-to
│   │   ├── project-info-panel.tsx        # Beat 4 (data-driven, 7 projects)
│   │   ├── stack-map-overlay.tsx         # Beat 5 technical credibility
│   │   ├── personality-panel.tsx         # Beat 6 music + writing + community
│   │   ├── future-panel.tsx              # Beat 7 personal curiosities
│   │   ├── contact-panel.tsx             # Beat 8 dawn finale
│   │   ├── progress-indicator.tsx        # Right-edge orbit path
│   │   ├── sound-toggle.tsx              # Top-right toggle
│   │   └── custom-cursor.tsx             # Lagging cursor (desktop)
│   │
│   └── ui-observatory/         # Custom UI primitives
│       ├── glass-panel.tsx               # Glassmorphism surface
│       ├── stack-chip.tsx                # Tech stack pill
│       ├── pillar-badge.tsx              # Color-coded per pillar
│       ├── building-now-badge.tsx        # Pulsing badge for in-progress
│       └── cta-button.tsx                # Primary + ghost variants
│
├── data/                       # All content is data-driven
│   ├── projects.ts             # 7 projects with titles, bodies, stack, CTAs
│   ├── beats.ts                # 8 beat definitions
│   └── stack-map.ts            # 20 stack entries with repo counts
│
└── lib/
    ├── store.ts                # Zustand store
    └── use-scroll.ts           # Scroll hook (RAF-throttled)
```

## The 8 beats

The visitor scrolls through 8 chapters:

1. **Arrival** — Observatory dome opens, hero text fades in.
2. **Introduction** — Who is the observer.
3. **Exploration** — How to use the telescope (scroll, hover, click).
4. **Projects** — 7 sub-beats, one per project. Each project is a celestial body.
5. **Technical credibility** — Holographic stack map with 20 technologies.
6. **Personality** — Music, writing, community, competition.
7. **What I want to understand next** — Personal curiosities (not career ambitions).
8. **Contact** — Dawn finale, contact links, wordmark.

## The 7 projects

| Project | Pillar | Body type | Status |
|---|---|---|---|
| FAST Isb Utilities (Exam-Table) | Web | Planet + ring | Complete |
| DramaGhar | Web | Binary planets | Complete |
| Hamara-Rozgar | AI | 5000-particle nebula | Building |
| GlucoGuard+ | AI | 4-pulse star | Complete |
| Internship-Finder | AI | Blinking satellite | Building |
| GCR Fetch | Web | Comet + trail | Complete |
| WayFinder | Mobile | Distant speck | Complete |

## Customization

- **Project content:** `src/data/projects.ts`
- **Beat copy:** `src/data/beats.ts`
- **Colors:** CSS variables in `src/app/globals.css`
- **Camera path:** `src/components/three/scene-constants.ts`
- **3D scene:** `src/components/three/scene.tsx`

## Accessibility

- `prefers-reduced-motion` triggers a static fallback (flat chapter cards, no 3D)
- 3D canvas is `aria-hidden="true"`; complete semantic HTML duplicate for screen readers
- All interactive elements are keyboard-navigable
- Color contrast meets WCAG AA

## Performance

- Initial JS bundle: ~135KB gzipped
- 3D chunk: ~230KB gzipped (lazy-loaded after first paint)
- 60 FPS target on desktop, 30 FPS on mid-range mobile
- Pixel ratio capped at 2

## Design documentation

The complete design rationale — 14 documents covering research, identity, storytelling, UX, 3D experience, visual design system, technical architecture, performance, and roadmap — is in `download/phase{6..16}_*.md`. The 10-agent content audit reports are at `download/content_audit_report*.md`.

## Deployment

```bash
# Vercel (recommended)
vercel

# Or connect the GitHub repo on vercel.com — auto-deploys on push to main
```

No environment variables needed. The portfolio is fully static.

## License

MIT

## Credits

- **Builder:** Muhammad Ammar Asad ([github.com/ammarasad2005](https://github.com/ammarasad2005))
- **Design + build:** Custom for this portfolio
- **Inspiration:** Bruno Simon, Codrops scroll-driven 3D world tutorials, Awwwards winners
