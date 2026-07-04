"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (error) {
      alert(
        "Login failed: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[color:var(--color-background)]">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <header className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
            Admin Login
          </h1>
          <p className="text-[13px] text-[color:var(--color-muted-foreground)]">
            관리자만 접근할 수 있습니다.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-[color:var(--color-card)] p-6 rounded-lg border border-[color:var(--color-border)] shadow-sm flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-muted-foreground)]">
              Username
            </label>
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="w-full px-3.5 py-3 text-sm border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-muted-foreground)]">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3.5 py-3 text-sm border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 px-4 bg-[color:var(--color-primary)] text-white font-bold text-sm rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
