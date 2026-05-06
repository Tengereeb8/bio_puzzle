"use server";

import { apiFetch } from "@/lib/api-server";
import type { User } from "@/lib/types";

/**
 * Fetches the currently signed-in user's profile from the backend API.
 * Returns null when the user is not signed in or the request fails.
 */
export async function getMe(): Promise<User | null> {
  try {
    return await apiFetch<User>("/users/me");
  } catch {
    return null;
  }
}
