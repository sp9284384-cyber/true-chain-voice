# TrueChain — Frontend

Next.js (App Router) + TypeScript + Tailwind frontend for TrueChain, built
against the FastAPI backend running at `http://localhost:8000`.

## Setup

```bash
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Requires the backend to be running for anything beyond the landing page's
static content to work (report submission, status checks, chain
verification, investigator login/dashboard all call the live API).

## What's built

| Prompt | Status | Pages |
|---|---|---|
| 1 — Report flow | Done | `/report`, `/report/confirmation`, `/status/[token]` |
| 2 — Public verify | Done | `/verify` |
| 0 — Landing page | Done (CSS 3D, see below) | `/` |
| 3 — Investigator | Done | `/investigator/login`, `/investigator/dashboard`, `/investigator/dashboard/[id]` |
| 4 — Polish | Done | loading/error states, 404, error boundary, fade transitions |

## Decisions worth knowing about

**Hero visual is CSS 3D, not react-three-fiber.** I built this without
network access, so I couldn't install `@react-three/fiber`/`@react-three/drei`
or test WebGL frame rates here — and the original prompt explicitly names a
pure-CSS `perspective`/`rotateY` version as the fallback if Three.js is
fighting you or underperforming. `components/landing/Hero3D.tsx` implements
that fallback: 7 glowing linked nodes in a slowly rotating ring, staggered
entrance on mount, faster rotation + stronger glow on hover — same visual
goal, zero WebGL/SSR risk. If you'd rather have the real R3F version, it's a
self-contained swap: replace `Hero3D.tsx` and add the two packages to
`package.json`.

**Investigator auth uses a session cookie, not localStorage — and not pure
React state either.** The brief says "React state or a simple auth context
— no localStorage." Pure in-memory state alone would mean any hard refresh
of the dashboard bounces the investigator back to `/login`, because
`middleware.ts` runs on the edge before React mounts and can't read React
state. So `lib/auth.tsx` keeps the token in React context as the source of
truth for components, and mirrors it into a cookie that has no
`Max-Age`/`Expires` — a true session cookie, cleared when the browser
closes, never written to disk the way `localStorage` is. That's what lets
`middleware.ts` protect `/investigator/*` server-side.

**IntegrityBadge lives on the report detail page, not the queue.** The
Overview doc's component list includes `IntegrityBadge.tsx` for a
per-report chain-status badge, but the actual `GET /investigator/reports`
response has no hash fields — showing it in the queue would mean an
extra `GET /verify/{id}` call per row on every page load. It's wired up on
`/investigator/dashboard/[id]` instead, where the report is already being
fetched individually.

**Page transition uses framer-motion, not a "Next.js built-in."** Next.js
App Router has no built-in transition primitive as of this Next version;
framer-motion was already a dependency for the landing page's scroll
reveals, so reusing it for the fade (`components/shared/PageTransition.tsx`)
doesn't add weight — it's a single 0.18s opacity fade, not the animation
library being used for anything heavier.

## Not yet wired up

- AI triage and embedding/clustering are backend-only per the connection
  map — nothing to build on the frontend for those.
- No end-to-end run against a live backend has happened in this
  environment (no network access here). Run through Prompt 4's full flow
  test once you have the backend up: submit → check status → verify chain
  → log in → view report → update status.
