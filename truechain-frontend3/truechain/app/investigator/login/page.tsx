"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, login } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function InvestigatorLoginPage() {
  const router = useRouter();
  const { login: setAuthToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { access_token } = await login({ username, password });
      setAuthToken(access_token);
      router.push("/investigator/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Incorrect username or password."
          : "Couldn't sign in right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-ink">Investigator sign in</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Restricted access. Reporters never need to sign in.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-card border border-line bg-surface px-3.5 py-2.5 text-ink focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-card border border-line bg-surface px-3.5 py-2.5 text-ink focus-visible:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-card bg-trust px-4 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? <LoadingSpinner label="Signing in" /> : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
