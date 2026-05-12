import { API_URL } from "./api-url";

export type ProgressApiUser = {
  totalPoints: number;
  level?: number;
  streak?: number;
};

async function readApiError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const j = (await res.json()) as { error?: string };
      return typeof j?.error === "string" ? j.error : "";
    }
  } catch {
    /* ignore */
  }
  try {
    const t = await res.text();
    if (t.includes("Cannot GET")) return "endpoint байхгүй (backend хуучин хувилбар)";
    return t.slice(0, 120).trim();
  } catch {
    return "";
  }
}

export async function postChapterQuiz(
  token: string,
  body: { chapterId: string; correctCount: number; totalCount: number },
): Promise<{ user: ProgressApiUser; pointsEarned?: number } | null> {
  const res = await fetch(`${API_URL}/progress/chapter-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ user: ProgressApiUser }>;
}

export async function postMiniGame(
  token: string,
  body: {
    gameKey: string;
    correctCount?: number;
    totalCount?: number;
    timeSeconds?: number;
  },
): Promise<{ user: ProgressApiUser } | null> {
  const res = await fetch(`${API_URL}/progress/mini-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ user: ProgressApiUser }>;
}

/** Жагсаалтын өгөгдөл — backend заавал `/leaderboard/global` route-тай байх ёстой */
export async function fetchGlobalLeaderboard(
  token: string | null,
): Promise<unknown> {
  const headers: HeadersInit = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/leaderboard/global`, { headers });
  if (!res.ok) {
    const extra = await readApiError(res);
    if (res.status === 404) {
      throw new Error(
        `Жагсаалтын API олдсонгүй (404). Bio-Puzzle-Backend-ийг Git-ээс сүүлийн кодоор deploy хийнэ үү. Одоогийн сервер: ${API_URL}`,
      );
    }
    throw new Error(
      extra ? `leaderboard ${res.status}: ${extra}` : `leaderboard ${res.status}`,
    );
  }
  return res.json();
}

export type ProfileApiPayload = {
  name: string;
  nameMn: string;
  streak: number;
  badges: Array<{
    id: string;
    name: string;
    nameMn: string;
    description: string;
    descriptionMn: string;
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  character?: unknown;
  bestTime?: number;
  totalGames?: number;
  lessonsCompleted?: number;
  rank?: number;
  totalUsers?: number;
  totalPoints?: number;
  level?: number;
};

/** Профайл — backend заавал `GET /users/me/profile` байх ёстой */
export async function fetchUserProfile(
  token: string,
): Promise<ProfileApiPayload | null> {
  const res = await fetch(`${API_URL}/users/me/profile`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const extra = await readApiError(res);
    if (res.status === 404) {
      throw new Error(
        `Профайлын API олдсонгүй (404). Bio-Puzzle-Backend шинэчилж deploy хийнэ үү (${API_URL}).`,
      );
    }
    if (res.status === 401) {
      throw new Error("Нэвтрэх хугацаа дууссан эсвэл token буруу байна.");
    }
    throw new Error(
      extra ? `profile ${res.status}: ${extra}` : `profile ${res.status}`,
    );
  }
  return res.json() as Promise<ProfileApiPayload>;
}
