"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/shared/Header";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ApiError } from "@/lib/types";
import { Loader, Lock } from "@/components/shared/icons";

export default function InvestigatorLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { setToken } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await login(username, password);
      setToken(res.access_token);
      const redirectTo = params.get("from") || "/investigator/dashboard";
      router.push(redirectTo);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(
        apiErr.status === 401
          ? "Incorrect username or password."
          : apiErr.message || "Couldn't sign in. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page flex items-center justify-center py-16 sm:py-24">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-line">
              <Lock className="h-5 w-5 text-signal-teal" />
            </div>
            <h1 className="text-2xl font-semibold">Investigator sign in</h1>
            <p className="mt-1 text-sm text-text-muted">
              For authorized investigators only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label htmlFor="username" className="field-label">
                Username
              </label>
              <input
                id="username"
                className="field-input"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-status-high" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? (
                <>
                  <Loader className="h-4 w-4" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
