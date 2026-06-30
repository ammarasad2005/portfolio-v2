# Portfolio · Muhammad Ammar Asad

> Full-Stack Engineer · CS undergrad @ FAST-NUCES Islamabad · Open to Summer / Fall 2026 internships

Personal portfolio website. Built from scratch — no template, no shortcuts.

**Live:** <https://portfolio-v2-ammarasad2005.vercel.app>  
**Source:** <https://github.com/ammarasad2005/portfolio-v2>

---

## What this is

A single-page portfolio with a section-aware 3D scene, editorial typography, and production-grade content sourced from real GitHub projects. The design avoids template aesthetics, generic gradients, and excessive animation — preferring timeless typography, intentional whitespace, and subtle motion.

The hero features a crystalline 3D monolith whose hue shifts as you scroll into each section. The body surfaces four shipped projects (with metrics, contributions, and stack tags), an engineering-notes section explaining three cross-cutting technical decisions, and a typed capabilities index.

## Tech stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript 5
- **Styling:** Tailwind CSS 4 · shadcn/ui (New York)
- **3D:** three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing
- **Motion:** Framer Motion
- **Theme:** next-themes (dark default, light available)
- **Icons:** lucide-react
- **Fonts:** Geist Sans · Geist Mono · Instrument Serif (italic display)

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata, JSON-LD Person schema
│   ├── page.tsx          # assembles all sections
│   ├── globals.css       # design tokens (color, type, motion)
│   ├── robots.ts
│   └── sitemap.ts
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
│   │   ├── theme-provider.tsx
│   │   ├── section-heading.tsx
│   │   ├── reveal.tsx         # scroll-reveal wrapper
│   │   └── noise-overlay.tsx
│   └── ui/              # shadcn/ui (existing)
├── data/
│   ├── projects.ts      # typed project data (4 case studies + 3 engineering notes)
│   ├── capabilities.ts  # typed skills data (6 groups, 27 capabilities)
│   ├── timeline.ts      # typed timeline data (5 entries)
│   └── personal.ts      # identity, nav, stats
└── hooks/
    ├── use-active-section.ts       # IntersectionObserver scrollspy
    └── use-prefers-reduced-motion.ts
```

## Sections

1. **Hero** — name, role, value prop, 3D scene, 4 stat chips, CTAs
2. **About** — narrative paragraph + sticky aside (current chapter, exploring, off-screen)
3. **Selected Work** — 4 project case studies with stamps, metrics, contributions, stack tags
4. **Capabilities** — 6 categorized groups with proficiency dots
5. **Timeline** — education, hackathons, achievements, volunteer (alternating layout)
6. **Engineering Notes** — 3 cross-cutting technical decisions (security headers, cron CI/CD, multi-agent LLM)
7. **Contact** — direct email + 4-link grid + availability status
8. **Footer** — colophon, nav, connect links

## Featured projects

| # | Project | Stack highlights |
|---|---------|------------------|
| 1 | **FAST Isb Utilities** (Exam-Table) | Next.js 14, Supabase, GitHub Actions cron, Groq AI |
| 2 | **GCR Fetch** | Chrome Extension MV3, OAuth 2.0, Vercel Serverless |
| 3 | **Hamara-Rozgar** | Multi-agent LLM, Ollama, Groq, OSM Nominatim, Capacitor |
| 4 | **DramaGhar** | Next.js 15, React 19, MongoDB Atlas, Supabase, Google Gemini, RBAC + JWT |

## Design philosophy

- **Three-token color discipline:** background / foreground / action (+ muted support)
- **Three-font stack:** Instrument Serif italic (display) + Geist Sans (body) + Geist Mono (labels)
- **Subtle SVG `feTurbulence` paper-grain overlay** at 4% opacity for depth
- **Section-aware 3D:** hue and rotation respond to active section + scroll progress
- **Reduced-motion respected:** 3D disabled, animations shortened
- **Mobile-first:** 3D degrades gracefully, postprocessing skipped, nav collapses to sheet

## Accessibility

- Semantic HTML (`main` / `nav` / `section` / `article` / `header` / `footer`)
- Proper heading hierarchy (one `h1`, `h2` per section, `h3`/`h4` for cards)
- ARIA labels + `aria-current` on active nav
- Visible `:focus-visible` outlines
- Keyboard-navigable (Tab works through all interactive elements)
- Mobile sheet has proper `SheetTitle` for screen readers

## SEO

- Full metadata (title template, description, OpenGraph, Twitter, robots)
- JSON-LD Person schema with sameAs links to GitHub/LinkedIn
- `robots.ts` + `sitemap.ts`
- Font preconnect to Google Fonts
- Semantic HTML throughout

## Performance

- 3D scene dynamically imported with `ssr: false` (never blocks first paint or SEO)
- `AdaptiveDpr` + `AdaptiveEvents` scale resolution under load
- Postprocessing skipped on mobile
- Fonts use `display: swap`
- No raster images — 3D + SVG only

## Quick start

```bash
# Install
bun install

# Dev
bun run dev

# Lint
bun run lint

# Build (production)
bun run build
```

## License

MIT — feel free to read, learn from, and adapt the patterns. Don't copy the content (it's personal).

## Contact

- **Email:** ammarasad321993@gmail.com
- **GitHub:** [@ammarasad2005](https://github.com/ammarasad2005)
- **LinkedIn:** [muhammad-ammar-asad](https://linkedin.com/in/muhammad-ammar-asad)
- **Location:** Islamabad, Pakistan
