# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MelodyCraft is a single-page marketing/storefront site for a custom-song service aimed at a US audience: customers submit a brief and professional producers deliver a studio-quality track in 24 hours. It is a Vite + React 18 + TypeScript app styled with Tailwind CSS v4. There is **no backend and no AI integration** — the order form and checkout are front-end demo flows. (Accounts/login are deferred to a future 1.0 version; the MVP has no login.)

> History note: this started as a Google AI Studio export with two Gemini-powered features (an AI song-concept generator and an AI image "Art Studio") and an "AI-looking" neon/cyberpunk theme. Both AI features and the neon styling were removed; the app no longer needs any API key.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the Vite dev server
npm run build      # production build to dist/
npm run lint       # tsc --noEmit (type-check)
npm run preview    # serve the production build locally
npm test           # run the Vitest suite once (npm run test:watch to watch)
```

`npm run lint` (`tsc --noEmit`) is the primary check — run it after edits. `tsconfig.json` has `strict`, `noUnusedLocals`, and `noUnusedParameters`, so unused imports/vars fail the build. There is also a small **Vitest** suite (`npm test`) covering pricing, checkout, and types (`*.test.tsx` / `*.test.ts`; setup in `src/test/setup.ts`). There is no ESLint or formatter.

**Windows helpers:** `start-dev.bat` (installs deps if needed, runs the server on `http://127.0.0.1:3000/`, opens the browser) and `stop-dev.bat`.

## Architecture

- `src/index.tsx` — entry point; mounts `<App/>` in a class-based `ErrorBoundary` and `React.StrictMode`.
- `src/index.css` — Tailwind v4 entry (`@import "tailwindcss"`). `@theme` defines `--font-sans` (Plus Jakarta Sans), `--font-display` (Fraunces serif — used via the `font-display` class on headings), and `--color-accent` (the gold token → drives `bg-accent`/`text-accent`/etc.). Utility classes: `.surface` (subtle card bg + hairline border) and `.hairline` (thin top border between sections), plus `animate-fade-in` / `animate-shake` and a `prefers-reduced-motion` block.
- `src/components/TrackPlayer.tsx` — custom on-brand audio card used by `Hero` (featured) and `AudioSamples`. Plays a track's **30s Spotify preview mp3** (`p.scdn.co`) inline (cover, play/pause, seekable range overlay, single-playback across the page via a module-level `currentAudio`). Track data (title, subtitle, `cover` = Spotify CDN image, `preview`, `href`) is inlined at the call sites. Chosen over an inline Spotify iframe, which shows a white "Preview" panel to logged-out visitors. `Navbar` has a mobile hamburger menu (`md:hidden`).
- `src/App.tsx` — the whole page. Holds top-level UI state as `useState` flags and composes the sections in conversion order (`Hero` → `TrustedBy` → `HowItWorks` → `AudioSamples` → `Testimonials` → `Pricing` → `FAQ` → `Footer`), toggling two modals via `framer-motion`'s `AnimatePresence`: `SongBuilderModal` (order form) and `CheckoutModal`. Accounts/login are deferred to a future 1.0 version, so the MVP has no login.
- `src/types.ts` — shared types: `Tier` (`'standard' | 'premium' | 'signature'`), `SongOrder` (the order-form brief), `OrderItem` (what checkout receives), and `TIER_PRICE` (`standard` = $9.99, `premium` = $39.99, `signature` = $89.99), plus `TIER_LABEL` / `TIER_NOTE`.
- `src/components/` — all UI components (single source of truth; one component per PascalCase file, `export const`, typed `React.FC`).

Flow: `SongBuilderModal` collects a brief (genre, occasion, who it's for, story) — **no AI** — and calls `onOrder(SongOrder)`, which `App` turns into an `OrderItem` and hands to `CheckoutModal`. There is no router; navigation is hash-based smooth-scroll to section ids (`#home`, `#how-it-works`, `#samples`, `#pricing`, `#faq`, `#contact`).

## Design system

Elegant, boutique "premium dark" look — deliberately restrained:
- **Palette:** warm near-black background (`#0b0a09` / `bg-stone-950`), warm off-white text, `stone` greys; a single **gold accent** via the `accent` token (`bg-accent`, `text-accent`, `border-accent/30`, etc.) used sparingly. No gradients-on-text, no neon glows, no animated background grid, no cursor trail.
- **Type:** section/hero headings use the **Fraunces serif** (`font-display` class) at `font-medium`; body uses Plus Jakarta Sans. Headings are normal case (not all-uppercase `font-black`).
- **Components:** cards use `.surface`; sections separate with `.hairline` and use `py-20 md:py-28`. Buttons are pill-shaped (`rounded-full`) in the hero/CTAs; primary = `bg-accent text-stone-950`, secondary = `border border-white/15` + `hover:bg-white/5`.
- **Mobile-first:** base styles target mobile; scale up with `sm:`/`md:`/`lg:`. The navbar collapses to a hamburger menu on mobile.

When adding UI, follow these tokens rather than reintroducing `glass`, `indigo/fuchsia/slate`/`amber-*` literals, gradient text, or heavy shadows.

## Deployment

Deployed to **Cloudflare** since 07.11.2026 — a Worker with static assets named
`melodycraft` (`wrangler.jsonc`), on the custom domains `melodycraft.io` and
`www.melodycraft.io`. `vite.config.ts` builds to `dist/` (gitignored) with `base: '/'`.
To publish: run **`deploy.bat`** (lint → tests → build → `npx wrangler deploy`); it needs
a wrangler login (`npx wrangler whoami`). The deploy commits nothing.

`docs/` is the old GitHub Pages build (`main` → `/docs`, base `/melodycraft.org/`), frozen
since 07.11.2026 and still served at `https://sikor1337.github.io/melodycraft.org/`. Never
edit it by hand and do not build into it. `.github/workflows/deploy.yml` is manual-only.
