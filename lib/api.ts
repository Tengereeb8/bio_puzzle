"use client";

import { useCallback, useMemo } from "react";
import { API_URL } from "@/lib/api-url";
import { useAuthContext } from "@/lib/auth-context";

type Json = Record<string, unknown> | unknown[];

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** Backend руу Bearer JWT залгана (local auth). */
export { API_URL };

export function useApi() {
  const { token, isHydrated } = useAuthContext();

  const request = useCallback(
    async <T = unknown>(
      path: string,
      options: RequestInit = {},
    ): Promise<T> => {
      const headers = new Headers(options.headers);
      headers.set("Content-Type", "application/json");

      if (isHydrated && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(`${API_URL}${path}`, { ...options, headers });

      if (!res.ok) throw new Error(await parseError(res));
      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    },
    [isHydrated, token],
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
