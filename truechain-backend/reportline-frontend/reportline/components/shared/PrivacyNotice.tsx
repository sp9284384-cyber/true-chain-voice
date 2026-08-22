export function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-card border border-line bg-trust-soft px-4 py-3 text-sm text-ink ${className}`}
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="mt-0.5 shrink-0 text-trust"
      >
        <path
          d="M12 3l7 3v5c0 4.6-2.98 8.9-7 10-4.02-1.1-7-5.4-7-10V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p>
        <span className="font-medium">We never collect your name, email, or IP address.</span>{" "}
        <span className="text-ink-muted">Nothing on this page can be traced back to you.</span>
      </p>
    </div>
  );
}
