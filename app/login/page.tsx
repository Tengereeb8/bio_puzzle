"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/lib/auth-context";
import { API_URL } from "@/lib/api-url";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as {
        token?: string;
        user?: { id: string; email: string; username: string; streak: number; age: number | null; createdAt: string };
        error?: string;
      };

      if (!res.ok || !data.token || !data.user) {
        setError(data.error ?? `Алдаа (${res.status})`);
        return;
      }

      login(data.token, data.user);
      router.replace("/");
      router.refresh();
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-12 pb-28">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Нэвтрэх</h1>
        <p className="text-sm text-muted-foreground mb-6">
          И-мэйл, нууц үгээ оруулна уу.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              И-мэйл
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Нууц үг
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10"
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-10" disabled={pending}>
            {pending ? "Уншиж байна…" : "Нэвтрэх"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Бүртгэл байхгүй юу?{" "}
          <Link href="/register" className="text-primary font-medium underline underline-offset-2">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
