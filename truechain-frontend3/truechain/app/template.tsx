/**
 * Next.js remounts `template.tsx` on every route change (unlike
 * layout.tsx, which persists), so the CSS fade-in below re-triggers on
 * every navigation automatically — no client state, no animation library,
 * just a built-in remount plus one keyframe.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
