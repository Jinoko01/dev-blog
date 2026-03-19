import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DevArchive Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex text-[color:var(--color-foreground)]">
        <aside className="w-72 bg-[color:var(--color-card)]/80 backdrop-blur-md border-r border-[color:var(--color-border)] flex-shrink-0">
          <div className="p-6 border-b border-[color:var(--color-border)]">
            <div className="text-sm font-semibold tracking-tight text-[color:var(--color-primary)]">
              Dev Blog
            </div>
            <h1 className="mt-1 font-bold text-xl tracking-tight text-[color:var(--color-card-foreground)]">
              Admin Console
            </h1>
            <p className="mt-2 text-xs text-[color:var(--color-muted-foreground)]">
              콘텐츠 · 아카이브 · 배포 전 점검
            </p>
          </div>

          <nav className="p-4 flex flex-col gap-2">
            {[
              { href: "/", label: "Dashboard" },
              { href: "/posts", label: "Posts" },
              { href: "/algorithms", label: "Algorithms" },
              { href: "/settings", label: "Settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)]/50 transition-colors border border-transparent hover:border-[color:var(--color-border)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
