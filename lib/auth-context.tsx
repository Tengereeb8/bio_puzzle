"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { API_URL } from "@/lib/api-url";

const TOKEN_KEY = "bio_auth_token_v1";
const USER_KEY = "bio_auth_user_v1";
const AUTH_CHANGE = "bio-auth-changed";

type AuthBlob = {
  token: string | null;
  user: User | null;
};

/** SSR / getServerSnapshot: ижил илж заавал байх — React дамжин дахин рендер хийнэ */
const SERVER_AUTH_SNAPSHOT = Object.freeze({
  token: null,
  user: null,
}) satisfies AuthBlob;

/** Клиент дээр getSnapshot давтан дуудагдах үед ижил утга бол ижил илж буцаана */
let clientAuthMemo: AuthBlob = SERVER_AUTH_SNAPSHOT;
let clientAuthMemoKey = "";

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE));
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === TOKEN_KEY || e.key === USER_KEY) {
      callback();
    }
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGE, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGE, onCustom);
  };
}

function readAuthFromStorage(): { token: string | null; user: User | null; key: string } {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  let user: User | null = null;
  if (raw) {
    try {
      user = JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }
  const key = `${token ?? ""}|${raw ?? ""}`;
  return { token, user, key };
}

/** Клиент: localStorage raw утга ('token|userJson') өөрчлөгдөөгүй бол ижил илж */
function authSnapshot(): AuthBlob {
  const next = readAuthFromStorage();

  if (clientAuthMemoKey === next.key) {
    return clientAuthMemo;
  }

  clientAuthMemoKey = next.key;
  if (next.token === null && next.user === null) {
    clientAuthMemo = SERVER_AUTH_SNAPSHOT;
  } else {
    clientAuthMemo = { token: next.token, user: next.user };
  }
  return clientAuthMemo;
}

function authSnapshotServer(): AuthBlob {
  return SERVER_AUTH_SNAPSHOT;
}

function useAuthFromStorage() {
  return useSyncExternalStore(subscribe, authSnapshot, authSnapshotServer);
}

/** True after hydration (SSR vs client)—localStorage утгыг SSR дээр бүү унш гэж тусгаарлана. */
function useClientHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  isSignedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuthFromStorage();
  const isHydrated = useClientHydrated();

  const clearAuth = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    emitAuthChange();
  }, []);

  useEffect(() => {
    if (!isHydrated || !token) return;

    let cancelled = false;

    void (async () => {
      try {
        const r = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (!r.ok) {
          clearAuth();
          return;
        }
        const u = (await r.json()) as User;
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        emitAuthChange();
      } catch {
        if (!cancelled) clearAuth();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, token, clearAuth]);

  const login = useCallback((tok: string, u: User) => {
    localStorage.setItem(TOKEN_KEY, tok);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    emitAuthChange();
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    (): AuthContextValue => ({
      token,
      user,
      isHydrated,
      isSignedIn: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, isHydrated, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside <AuthProvider>");
  return ctx;
}
