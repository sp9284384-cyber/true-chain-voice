export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-card bg-surface-raised ${className}`} aria-hidden="true" />;
}
