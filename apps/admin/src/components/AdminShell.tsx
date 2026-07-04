"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "./AuthGuard";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/algorithms", label: "Algorithms" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <aside
        className="w-72 flex-shrink-0 flex flex-col min-h-screen"
        style={{
          background: "color-mix(in oklch, var(--card) 80%, transparent)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div className="p-6 border-b border-[color:var(--color-border)]">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-primary)]">
            OKOJIN.LOG
          </div>
          <h1 className="mt-1.5 font-black text-xl tracking-tight text-[color:var(--color-card-foreground)]">
            Admin Console
          </h1>
          <p className="mt-2.5 text-[11px] text-[color:var(--color-muted-foreground)]">
            콘텐츠 · 아카이브 · 배포 전 점검
          </p>
        </div>

        <nav className="p-4 flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors border ${
                  active
                    ? "text-[color:var(--color-foreground)] bg-[color:var(--color-secondary)] border-[color:var(--color-border)]"
                    : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)] border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[color:var(--color-border)]">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-[color:var(--color-background)]">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </AuthGuard>
  );
}
