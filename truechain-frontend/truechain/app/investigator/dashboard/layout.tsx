"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { LinkChain, LogOut } from "@/components/shared/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Middleware already gates this route at the edge using the session
  // cookie; this is the client-side mirror so the UI never flashes
  // protected content before the redirect lands.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/investigator/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner label="Checking session…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-ink-950/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href="/investigator/dashboard"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
          >
            <LinkChain className="h-5 w-5 text-signal-teal" />
            TrueChain <span className="text-text-faint">/ Investigator</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/investigator/login");
            }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-muted transition hover:text-signal-teal"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>
      <main className="container-page py-10">{children}</main>
    </div>
  );
}
