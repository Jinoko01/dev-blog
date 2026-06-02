# Post Likes 공유 상태 + API Route Handler 프록시 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모든 API 호출을 Next.js Catch-all Route Handler로 프록시하여 캐시 제어권을 확보하고, Jotai atomFamily로 좋아요 상태를 공유해 헤더와 버튼이 항상 동기화되도록 한다.

**Architecture:** Next.js `app/api/[...path]/route.ts` 가 모든 요청을 Spring Boot로 포워딩하며, GET은 태그 캐싱, POST/DELETE는 요청 후 `revalidateTag`로 즉시 무효화한다. 프론트엔드 `api.ts`는 Spring Boot 직접 호출 대신 `/api/...` 상대경로를 사용한다. 좋아요 상태는 `likesAtomFamily(slug)`로 관리해 `PostMetricsDisplay`(헤더)와 `PostLikeButton`(댓글)이 동일한 atom을 공유한다.

**Tech Stack:** Next.js 16 App Router, Jotai, TypeScript strict

---

## 파일 구조

| 파일 | 역할 |
|------|------|
| `apps/web/src/app/api/[...path]/route.ts` | 신규: catch-all 프록시 핸들러 |
| `apps/web/src/store/post-metrics.ts` | 신규: likesAtomFamily + handleLike 액션 |
| `apps/web/src/lib/api.ts` | 수정: base URL 분기, getPost revalidate 수정 |
| `apps/web/src/components/post-metrics.tsx` | 수정: 로컬 state → Jotai atom |
| `apps/web/src/app/posts/[slug]/page.tsx` | 수정: JotaiProvider 감싸기 |

---

### Task 1: Jotai 설치

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Jotai 설치**

```bash
cd apps/web && pnpm add jotai
```

- [ ] **Step 2: 설치 확인**

```bash
node -e "require('./node_modules/jotai')" && echo "OK"
```

Expected: `OK`

- [ ] **Step 3: 커밋**

```bash
git add apps/web/package.json apps/web/pnpm-lock.yaml
git commit -m "chore: add jotai to web app"
```

---

### Task 2: Catch-all Route Handler 프록시 생성

**Files:**
- Create: `apps/web/src/app/api/[...path]/route.ts`

- [ ] **Step 1: 파일 생성**

`apps/web/src/app/api/[...path]/route.ts`

```ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

/** 경로에 따라 fetch 태그를 결정한다 */
function resolveTag(segments: string[]): string | null {
  // segments 예시: ['posts'], ['posts', 'my-slug'], ['posts', 'my-slug', 'like']
  if (segments[0] === "posts") {
    if (segments.length === 1) return "posts";
    const slug = segments[1];
    return `post-${slug}`; // posts/:slug, posts/:slug/view, posts/:slug/like 모두 동일 태그
  }
  if (segments[0] === "algorithms") {
    if (segments.length === 1) return "algorithms";
    return `algorithm-${segments[1]}`;
  }
  if (segments[0] === "articles") return "articles";
  if (segments[0] === "tags") return "tags";
  if (segments[0] === "stats") return "stats";
  return null;
}

function buildBackendUrl(segments: string[], search: string): string {
  return `${BACKEND_URL}/api/${segments.join("/")}${search}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const tag = resolveTag(path);
  const url = buildBackendUrl(path, req.nextUrl.search);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    ...(tag ? { next: { revalidate: 60, tags: [tag] } } : { cache: "no-store" }),
  });

  const body = res.status === 204 ? null : await res.json();
  return NextResponse.json(body, { status: res.status });
}

async function mutate(
  req: NextRequest,
  segments: string[],
  method: "POST" | "DELETE",
): Promise<NextResponse> {
  const url = buildBackendUrl(segments, "");
  const contentType = req.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await req.text() : undefined;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...(body ? { body } : {}),
  });

  const tag = resolveTag(segments);
  if (tag) revalidateTag(tag);

  const resBody = res.status === 204 ? null : await res.json();
  return NextResponse.json(resBody, { status: res.status });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return mutate(req, path, "POST");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return mutate(req, path, "DELETE");
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/app/api
git commit -m "feat: add catch-all route handler proxy with revalidateTag"
```

---

### Task 3: api.ts — base URL 분기 및 getPost revalidate 수정

**Files:**
- Modify: `apps/web/src/lib/api.ts`

- [ ] **Step 1: `getApiBaseUrl` 함수를 서버/클라이언트 분기로 교체**

`apps/web/src/lib/api.ts`의 `getApiBaseUrl` 함수를 아래로 교체한다:

```ts
export function getApiBaseUrl() {
  // 클라이언트: 상대 경로 (브라우저가 자동으로 origin 붙임)
  if (typeof window !== "undefined") return "";
  // 서버 컴포넌트: 절대 경로 필요
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return appUrl.replace(/\/$/, "");
}
```

- [ ] **Step 2: `apiFetch` 경로를 `/api/...`로 변경**

`apiFetch` 함수 내 fetch URL을 아래와 같이 수정한다:

```ts
async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const response = await fetch(`${getApiBaseUrl()}/api${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

- [ ] **Step 3: `getPost` revalidate 600 → 60으로 수정**

```ts
export async function getPost(slug: string) {
  return apiFetch<ApiPostDetail>(`/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
}
```

- [ ] **Step 4: `next: { revalidate: 600 }` 가 남아있는 다른 함수 확인 후 적절히 조정**

`getPosts`, `getTags`, `getArticles`, `getAlgorithms`, `getAlgorithm`의 revalidate 값은 현재 값 유지 (좋아요와 무관). `getPost`만 60으로 변경한 것이 맞다.

- [ ] **Step 5: 타입 체크 + lint**

```bash
cd apps/web && npx tsc --noEmit && npx eslint src/lib/api.ts
```

Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add apps/web/src/lib/api.ts
git commit -m "fix: proxy all API calls through Next.js route handler, fix getPost revalidate"
```

---

### Task 4: Jotai store 생성 — likesAtomFamily

**Files:**
- Create: `apps/web/src/store/post-metrics.ts`

- [ ] **Step 1: 파일 생성**

`apps/web/src/store/post-metrics.ts`

```ts
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { incrementPostLike, decrementPostLike } from "@/lib/api";

type LikesState = {
  likes: number;
  isLiked: boolean;
  isPending: boolean;
};

/**
 * slug별 likes 상태 atom. slug가 다르면 독립된 인스턴스가 생성된다.
 * initialLikes는 첫 생성 시에만 사용되며, initLikesAtom으로 덮어쓴다.
 */
export const likesAtomFamily = atomFamily((_slug: string) =>
  atom<LikesState>({ likes: 0, isLiked: false, isPending: false }),
);

/**
 * 서버에서 받은 initialLikes로 atom을 초기화하는 write-only atom.
 * PostMetricsDisplay 또는 PostLikeButton 마운트 시 1회 호출한다.
 */
export const initLikesAtom = atom(
  null,
  (get, set, { slug, initialLikes }: { slug: string; initialLikes: number }) => {
    const current = get(likesAtomFamily(slug));
    // 이미 초기화된 경우(isPending 등 상태 있음) 덮어쓰지 않는다
    if (current.likes === 0 && !current.isLiked) {
      const isLiked =
        typeof window !== "undefined"
          ? Boolean(localStorage.getItem(`liked_${slug}`))
          : false;
      set(likesAtomFamily(slug), { likes: initialLikes, isLiked, isPending: false });
    }
  },
);

/**
 * 좋아요 토글 액션. 낙관적 업데이트 후 API 호출, 실패 시 롤백.
 */
export const toggleLikeAtom = atom(
  null,
  async (get, set, slug: string) => {
    const state = get(likesAtomFamily(slug));
    if (state.isPending) return;

    const wasLiked = state.isLiked;
    const nextLiked = !wasLiked;

    // 낙관적 업데이트
    set(likesAtomFamily(slug), {
      likes: state.likes + (nextLiked ? 1 : -1),
      isLiked: nextLiked,
      isPending: true,
    });

    if (nextLiked) {
      localStorage.setItem(`liked_${slug}`, "true");
    } else {
      localStorage.removeItem(`liked_${slug}`);
    }

    try {
      const data = wasLiked
        ? await decrementPostLike(slug)
        : await incrementPostLike(slug);

      set(likesAtomFamily(slug), {
        likes: data.likes,
        isLiked: nextLiked,
        isPending: false,
      });
    } catch {
      // 롤백
      set(likesAtomFamily(slug), {
        likes: state.likes,
        isLiked: wasLiked,
        isPending: false,
      });
      if (wasLiked) {
        localStorage.setItem(`liked_${slug}`, "true");
      } else {
        localStorage.removeItem(`liked_${slug}`);
      }
    }
  },
);
```

- [ ] **Step 2: 타입 체크**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/store
git commit -m "feat: add likesAtomFamily and toggleLikeAtom with optimistic update"
```

---

### Task 5: post-metrics.tsx — Jotai atom으로 교체

**Files:**
- Modify: `apps/web/src/components/post-metrics.tsx`

- [ ] **Step 1: 파일 전체 교체**

`apps/web/src/components/post-metrics.tsx`를 아래 내용으로 교체한다:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { incrementPostView } from "@/lib/api";
import { likesAtomFamily, initLikesAtom, toggleLikeAtom } from "@/store/post-metrics";
import { Heart, Eye } from "lucide-react";

/** views 표시 + view 카운트 증가 */
function usePostViews(slug: string, initialViews: number) {
  const [views, setViews] = useState(initialViews);
  const initLikes = useSetAtom(initLikesAtom);

  useEffect(() => {
    const initMetrics = async () => {
      const today = new Date().toISOString().split("T")[0];
      const viewKey = `viewed_${slug}_${today}`;

      if (!localStorage.getItem(viewKey)) {
        const metrics = await incrementPostView(slug);
        setViews(metrics.views);
        // view 증가 응답에서 받은 최신 likes로 atom 업데이트
        initLikes({ slug, initialLikes: metrics.likes });
        localStorage.setItem(viewKey, "true");
      }
    };

    initMetrics();
  }, [slug, initLikes]);

  return views;
}

/** header description 아래에 views/likes 수치를 텍스트로 표시하는 컴포넌트 */
export function PostMetricsDisplay({
  slug,
  initialViews,
  initialLikes,
}: {
  slug: string;
  initialViews: number;
  initialLikes: number;
}) {
  const views = usePostViews(slug, initialViews);
  const initLikes = useSetAtom(initLikesAtom);
  const [{ likes }] = useAtom(likesAtomFamily(slug));

  // atom 초기화 (view를 이미 카운트한 날에도 초기값 설정)
  useEffect(() => {
    initLikes({ slug, initialLikes });
  }, [slug, initialLikes, initLikes]);

  return (
    <div className="flex items-center justify-center gap-4 text-sm mt-4">
      <span className="flex items-center gap-1.5 opacity-80">
        <Eye className="w-4 h-4" />
        <span className="font-medium">{views}</span>
        <span className="opacity-70">views</span>
      </span>
      <span className="opacity-30">·</span>
      <span className="flex items-center gap-1.5 opacity-80">
        <Heart className="w-4 h-4" />
        <span className="font-medium">{likes}</span>
        <span className="opacity-70">likes</span>
      </span>
    </div>
  );
}

/** Comments 제목 우측에 표시할 like 버튼 컴포넌트 */
export function PostLikeButton({
  slug,
  initialLikes,
}: {
  slug: string;
  initialLikes: number;
}) {
  const initLikes = useSetAtom(initLikesAtom);
  const [{ likes, isLiked, isPending }] = useAtom(likesAtomFamily(slug));
  const toggleLike = useSetAtom(toggleLikeAtom);

  useEffect(() => {
    initLikes({ slug, initialLikes });
  }, [slug, initialLikes, initLikes]);

  return (
    <button
      onClick={() => toggleLike(slug)}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
        isLiked
          ? "text-pink-500 border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/30"
          : "text-foreground/50 border-black/10 dark:border-white/10 hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20"
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}
```

- [ ] **Step 2: 타입 체크 + lint**

```bash
cd apps/web && npx tsc --noEmit && npx eslint src/components/post-metrics.tsx
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/post-metrics.tsx
git commit -m "feat: replace local likes state with shared Jotai atom"
```

---

### Task 6: page.tsx — JotaiProvider로 감싸기

**Files:**
- Modify: `apps/web/src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: JotaiProvider import 추가 및 JSX 감싸기**

`apps/web/src/app/posts/[slug]/page.tsx` 파일 상단에 import 추가:

```ts
import { Provider as JotaiProvider } from "jotai";
```

그리고 `return` 블록의 최상위 `<div>`를 `<JotaiProvider>`로 감싼다:

```tsx
return (
  <JotaiProvider>
    <div className="w-full min-w-0 min-h-screen relative z-10">
      {/* ... 기존 내용 그대로 ... */}
    </div>
  </JotaiProvider>
);
```

> **주의:** `JotaiProvider`는 slug별로 atom 스토어를 격리한다. 페이지 컴포넌트에 감싸야 slug 전환 시 상태가 오염되지 않는다.

- [ ] **Step 2: 타입 체크**

```bash
cd apps/web && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 빌드 확인**

```bash
cd apps/web && npx next build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` 또는 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/app/posts/[slug]/page.tsx
git commit -m "feat: wrap post page with JotaiProvider for scoped likes state"
```

---

### Task 7: 환경변수 확인 및 동작 검증

**Files:**
- 확인: `apps/web/.env.local` (또는 `.env`)

- [ ] **Step 1: `NEXT_PUBLIC_APP_URL` 환경변수 확인**

`.env.local`에 아래 값이 없으면 추가한다:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

서버 컴포넌트에서 `/api/...` 호출 시 절대 URL이 필요하므로 반드시 설정되어야 한다.

- [ ] **Step 2: dev 서버 실행**

```bash
cd apps/web && pnpm dev
```

- [ ] **Step 3: 동작 검증 체크리스트**

브라우저에서 `http://localhost:3000/posts/{slug}` 접속 후 확인:

1. 헤더의 likes 수가 표시되는가
2. 댓글 위 좋아요 버튼 클릭 시 **헤더의 likes 수도 함께 변경**되는가
3. 좋아요 클릭 후 페이지 새로고침 시 likes 수가 반영되는가 (60초 이내 ISR 적용)
4. Network 탭에서 `/api/posts/{slug}/like` 호출이 Next.js 서버로 가는가 (Spring Boot 직접 호출 아님)
5. 브라우저 콘솔에 에러가 없는가

- [ ] **Step 4: 최종 커밋**

```bash
git add apps/web/.env.local
git commit -m "chore: add NEXT_PUBLIC_APP_URL for server-side API proxy"
```
