# Admin Auth Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect all admin routes so unauthenticated users are redirected to `/login`, and add a logout button to the sidebar.

**Architecture:** A single `AuthGuard` client component wraps the layout's sidebar+content area; it reads the JWT token from `localStorage` on mount and redirects to `/login` if absent. The `/login` route is intentionally excluded from the guard. `adminFetch` in `api.ts` is extended to detect 401 responses, clear the token, and trigger a redirect to `/login`.

**Tech Stack:** Next.js 16 App Router, TypeScript, localStorage-based JWT, `next/navigation` (`useRouter`)

---

### Task 1: Add AuthGuard component

**Files:**
- Create: `apps/admin/src/components/AuthGuard.tsx`

- [ ] **Step 1: Create the AuthGuard component**

Create `apps/admin/src/components/AuthGuard.tsx` with the following content:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/api";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return <>{children}</>;
}
```

- [ ] **Step 2: Verify the file was created correctly**

Run:
```powershell
Get-Content "apps\admin\src\components\AuthGuard.tsx"
```
Expected: file contents printed without error.

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/components/AuthGuard.tsx
git commit -m "feat(admin): add AuthGuard client component for route protection"
```

---

### Task 2: Add LogoutButton component

**Files:**
- Create: `apps/admin/src/components/LogoutButton.tsx`

- [ ] **Step 1: Create the LogoutButton component**

Create `apps/admin/src/components/LogoutButton.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAdminToken();
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 w-full text-left"
    >
      Logout
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/components/LogoutButton.tsx
git commit -m "feat(admin): add LogoutButton component"
```

---

### Task 3: Update layout to use AuthGuard and LogoutButton

**Files:**
- Modify: `apps/admin/src/app/layout.tsx`

The current layout is a Server Component with a sidebar that has a "Login" nav link. We need to:
1. Wrap the entire `<body>` content (except `/login` page itself) with `AuthGuard`
2. Replace the "Login" sidebar link with `LogoutButton`

The cleanest approach: create a separate `AdminShell` client wrapper that includes `AuthGuard` + sidebar + `LogoutButton`, then use it from `layout.tsx`. This keeps `layout.tsx` a Server Component (needed for `metadata` export) while allowing client logic.

- [ ] **Step 1: Create AdminShell component**

Create `apps/admin/src/components/AdminShell.tsx`:

```tsx
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

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <aside className="w-72 bg-[color:var(--color-card)]/80 backdrop-blur-md border-r border-[color:var(--color-border)] flex-shrink-0 flex flex-col">
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

        <nav className="p-4 flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)]/50 transition-colors border border-transparent hover:border-[color:var(--color-border)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[color:var(--color-border)]">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </AuthGuard>
  );
}
```

- [ ] **Step 2: Replace layout.tsx body content with AdminShell**

Replace the full contents of `apps/admin/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";
import "./globals.css";

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
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/admin/src/components/AdminShell.tsx apps/admin/src/app/layout.tsx
git commit -m "feat(admin): integrate AuthGuard and logout button into layout"
```

---

### Task 4: Handle 401 responses in adminFetch

**Files:**
- Modify: `apps/admin/src/lib/api.ts`

When a token expires, the backend returns 401. The current `apiFetch` throws a generic error but does not clear the stale token or redirect. We fix this in `adminFetch`.

- [ ] **Step 1: Update adminFetch in api.ts**

In `apps/admin/src/lib/api.ts`, replace the `adminFetch` function (lines 134–150) with:

```ts
async function adminFetch<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {},
) {
  const token = getAdminToken();
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Admin login is required.");
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.message || body?.error || `${response.status} ${path}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

Note: `adminFetch` now handles the full fetch lifecycle itself instead of delegating to `apiFetch`, so that 401 can be intercepted before the generic error handler runs.

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/lib/api.ts
git commit -m "feat(admin): redirect to login on 401 in adminFetch"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
cd apps/admin && pnpm dev
```

- [ ] **Step 2: Verify unauthenticated redirect**

Open `http://localhost:3000` in a browser with no token in localStorage. Expected: redirected to `/login`.

- [ ] **Step 3: Verify login flow**

Submit valid credentials on `/login`. Expected: redirected to `/` (Dashboard), sidebar visible with Logout button.

- [ ] **Step 4: Verify logout**

Click Logout. Expected: redirected to `/login`, sidebar not shown.

- [ ] **Step 5: Verify /login is accessible without auth**

While logged out, navigate directly to `http://localhost:3000/login`. Expected: login form shown (no infinite redirect loop).

- [ ] **Step 6: Run lint**

```bash
cd apps/admin && pnpm lint
```
Expected: no errors.
