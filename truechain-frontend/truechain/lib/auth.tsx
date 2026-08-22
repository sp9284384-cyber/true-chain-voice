"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Investigator auth lives here and nowhere else in the frontend — this is
 * the one file that ever touches anything identity/session-related.
 *
 * Storage choice: the access token is held in React state (in memory) as
 * the source of truth for components. We also mirror it into a
 * non-persistent, session-only cookie (no Max-Age/Expires, so it's cleared
 * when the browser closes and never written to disk the way localStorage
 * is). That cookie exists for exactly one reason: Next.js middleware runs
 * on the edge, before React mounts, and can't read React state — it can
 * only read cookies/headers. Without it, every hard refresh of the
 * dashboard would bounce an investigator back to /login. We deliberately
 * do NOT use localStorage/sessionStorage per the project's storage rule.
 */

const COOKIE_NAME = "tc_investigator_token";

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  // No Max-Age/Expires => session cookie, gone when the browser closes.
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; SameSite=Strict`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`;
}

function readAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, recover the token from the session cookie (survives a
  // refresh within the same browser session, matching middleware's view).
  useEffect(() => {
    setTokenState(readAuthCookie());
    setIsLoading(false);
  }, []);

  const setToken = useCallback((next: string) => {
    setTokenState(next);
    setAuthCookie(next);
  }, []);

  const logout = useCallback(() => {
    setTokenState(null);
    clearAuthCookie();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
