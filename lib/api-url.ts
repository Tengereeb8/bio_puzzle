/** Backend суурь хаяг — auth, curriculum гэх мэт бүх API-д нэгэн адил. */
function normalizeApiBase(url: string): string {
  const t = url.trim();
  return t.replace(/\/+$/, "") || "http://localhost:4000";
}

export const API_URL = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000",
);
