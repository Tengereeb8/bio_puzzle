/**
 * Frontend + Clerk middleware нь аль алинд ч ашиглана.
 * Нэвтрэлтийн UI болон JWT идэвхтэй байхад publishable + secret хоёр шаардлагатай.
 */
export function isClerkFullyConfigured(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sk = process.env.CLERK_SECRET_KEY;

  const publishableOk =
    typeof pk === "string" &&
    pk.startsWith("pk_") &&
    !pk.includes("your_publishable_key_here");

  const secretOk =
    typeof sk === "string" &&
    sk.startsWith("sk_") &&
    !sk.includes("your_secret_key_here");

  return publishableOk && secretOk;
}
