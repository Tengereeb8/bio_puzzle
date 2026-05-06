"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Json = Record<string, unknown> | unknown[];

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/**
 * Client-side API hook. Automatically attaches the Clerk JWT to every request.
 *
 * Example:
 *   const api = useApi();
 *   const me = await api.get<User>("/users/me");
 */
export function useApi() {
  const { getToken, isSignedIn } = useAuth();

  const request = useCallback(
    async <T = unknown>(
      path: string,
      options: RequestInit = {},
    ): Promise<T> => {
      const headers = new Headers(options.headers);
      headers.set("Content-Type", "application/json");

      if (isSignedIn) {
        const token = await getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(`${API_URL}${path}`, { ...options, headers });

      if (!res.ok) throw new Error(await parseError(res));
      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    },
    [getToken, isSignedIn],
  );

  return useMemo(
    () => ({
      get: <T>(path: string) => request<T>(path),
      post: <T>(path: string, body?: Json) =>
        request<T>(path, {
          method: "POST",
          body: body ? JSON.stringify(body) : undefined,
        }),
      patch: <T>(path: string, body?: Json) =>
        request<T>(path, {
          method: "PATCH",
          body: body ? JSON.stringify(body) : undefined,
        }),
      delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
    }),
    [request],
  );
}
