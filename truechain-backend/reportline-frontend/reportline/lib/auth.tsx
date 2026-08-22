"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Investigator auth lives here, and nowhere else in the frontend.
 *
 * The access token itself is kept only in React state — it is never written
 * to localStorage or sessionStorage, so it disappears the moment the tab is
 * closed or refreshed (the investigator just logs in again).
 *
 * Next.js middleware runs on the server/edge, before any React component
 * mounts, so it has no way to read this in-memory state directly. To let
 * middleware still gate /investigator/* routes, login() also sets a small,
 * non-persistent, httpOnly-style session cookie (`rl_session`, no maxAge —
 * it dies with the browser session). The cookie only signals "a session
 * exists"; it never carries the token itself, and it is not the mechanism
 * that authorizes API calls — every request to the backend still sends the
 * real bearer token from context. This is a deliberate middle ground, not
 * an oversight: true edge middleware cannot see client state, full
 * statelessness would mean no middleware at all.
 */

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function setSessionMarkerCookie() {
  // Session cookie: no max-age/expires, so the browser drops it when it closes.
  document.cookie = "rl_session=1; path=/; SameSite=Strict";
}

function clearSessionMarkerCookie() {
  document.cookie = "rl_session=; path=/; max-age=0; SameSite=Strict";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setSessionMarkerCookie();
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    clearSessionMarkerCookie();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
