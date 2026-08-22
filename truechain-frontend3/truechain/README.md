# TrueChain — frontend

Next.js (App Router) + TypeScript + Tailwind frontend for TrueChain, an
anonymous harassment/corruption reporting platform. Built against the
FastAPI backend contract in the build prompts: report submission, public
chain verification, and the investigator dashboard, plus a 3D hash-chain
hero on the landing page.

## Setup

```bash
npm install
cp .env.local.example .env.local   # points NEXT_PUBLIC_API_URL at your FastAPI backend (default http://localhost:8000)
npm run dev
```

Not built/run in this environment (no network access here) — this is
source only. `npm install` pulls in `@react-three/fiber`, `@react-three/drei`,
`three`, and `framer-motion` for the landing page; everything else is
dependency-free.

## Page map

| Route | Purpose |
|---|---|
| `/` | Landing page — 3D hash-chain hero, how-it-works, why-trust-this |
| `/report` | Anonymous submission form (no name/email field, ever) |
| `/report/confirmation` | Shows the session token once, nothing else |
| `/status/[token]` | Reporter checks their own status |
| `/verify` | Public, no-login chain verification — the demo centerpiece |
| `/investigator/login` | Auth entry point |
| `/investigator/dashboard` | Urgency-sorted report queue (auth-gated) |
| `/investigator/dashboard/[id]` | Report detail + status-update (append-only) |

## Judgment calls worth knowing about

- **3D hero, no SSR**: `components/landing/HeroScene.tsx` uses
  `@react-three/fiber`, which can't render on the server. `Hero.tsx` loads
  it via `next/dynamic(..., { ssr: false })` inside a `<Suspense>` boundary,
  with `HeroChainFallback.tsx` (pure CSS, no WebGL) as both the dynamic-import
  loading state and the Suspense fallback — so there's never a blank box.
  Rotation is auto-only (`OrbitControls` with `enableRotate={false}`,
  `autoRotate` on) so a stray cursor can't spin the framing off-center
  mid-demo; hovering the canvas nudges the rotation speed and is the only
  interaction exposed. If this scene ever fights you in a real perf test on
  a mid-range laptop, the fallback component is already a legitimate
  standalone visual — you can just render `HeroChainFallback` directly and
  drop the WebGL dependency without touching the rest of the page.

- **Investigator auth, no localStorage**: the access token lives only in
  React state (`lib/auth.tsx`) and disappears on refresh or tab close.
  Since Next.js middleware runs server-side and can't see that state,
  `middleware.ts` checks a separate, non-persistent session cookie
  (`rl_session`, no `maxAge`) just to decide whether to let a page render.
  The cookie never carries the token and never authorizes an API call —
  every request still sends the real bearer token from context. Practical
  side effect: refreshing a dashboard page bounces the investigator back to
  `/investigator/login` even though middleware let the page through, since
  the in-memory token is gone. The dashboard pages handle that redirect
  themselves rather than failing silently.

- **API contract**: `lib/types.ts` and `lib/api.ts` mirror the field names
  in the spec exactly (`content` not `description`, `total_records` /
  `broken_at_report_id` not `record_count` / `broken_at`, PATCH body is
  `{ new_status, updated_by? }`) — no renaming happens in the frontend, so
  what you see in a Network tab is what the backend actually sent.

- **Page transitions**: `app/template.tsx` relies on Next's own behavior of
  remounting `template.tsx` on every route change, paired with one CSS
  keyframe (`page-transition` in `globals.css`). No animation library in
  the transition path itself, per the polish-pass note — `framer-motion` is
  only used for the landing page's scroll-triggered fades, not for routing.

- **Dark theme**: the whole app (not just the landing hero) uses the dark
  navy/charcoal + single-teal-accent palette from Prompt 0's design
  direction, defined once in `tailwind.config.ts` under semantic names
  (`paper`, `surface`, `ink`, `trust`, etc.) so every page — including the
  report form and investigator dashboard — stays visually consistent
  without re-deriving colors per page.
