# ReportLine — frontend

Next.js (App Router) + TypeScript + Tailwind frontend for the anonymous
reporting platform described in `Overview.docx`. Ships the three flows:
public report submission, public chain verification, and the auth-gated
investigator dashboard.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your FastAPI backend
npm run dev
```

## Notes on a couple of judgment calls

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
  themselves.
- **`/report/confirmation`**: reads `?token=` client-side via
  `useSearchParams`, wrapped in `<Suspense>` as required by the App Router.
  It renders only the token and the privacy notice — no report content,
  no category, nothing else that could be screenshotted alongside it.
- **`/verify`**: no dependencies beyond `fetch`, verifies on mount, and the
  chain visualizer is a pure SVG/CSS component (no charting library) so it
  stays fast for a live demo.
