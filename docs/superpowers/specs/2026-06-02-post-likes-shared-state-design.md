# Post Likes Shared State — Design Spec

**Date:** 2026-06-02  
**Status:** Approved

## Problem

`PostMetricsDisplay` (header) and `PostLikeButton` (comments area) each maintain their own independent `likes` state. Clicking the like button in the comments section does NOT update the header like count. Additionally, `getPost` fetch cache (600s) is misaligned with page-level ISR revalidation (60s), causing stale `initialLikes` after page reload.

## Solution

Replace per-component local `likes` state with **Jotai `atomFamily`**, scoped per slug. This guarantees:

1. Both components read/write the same atom → always in sync.
2. slug 전환 시 별도 reset 로직 없이 자동 격리 (slug별 atom 인스턴스).

## Architecture

### New Files

```
apps/web/src/store/
  post-metrics.ts           # atomFamily definition + like action atoms
```

### Modified Files

```
apps/web/src/components/
  post-metrics.tsx          # useAtom(likesAtom(slug)) 으로 교체
  giscus-comments.tsx       # 변경 없음 (PostLikeButton은 post-metrics.tsx 내부)
apps/web/src/app/posts/[slug]/page.tsx  # Provider 감싸기 (JotaiProvider)
apps/web/src/lib/api.ts     # getPost revalidate: 600 → 60
```

## Data Flow

```
page.tsx (Server Component)
  └─ <JotaiProvider>         ← Next.js App Router 격리용
       ├─ PostMetricsDisplay
       │    └─ useAtom(likesAtomFamily(slug))   → likes 읽기
       └─ GiscusComments
            └─ PostLikeButton
                 └─ useAtom(likesAtomFamily(slug))   → likes 읽기/쓰기
```

## Store Design (`store/post-metrics.ts`)

```ts
// atom 구조
likesAtomFamily(slug: string) → atom<{ likes: number; isLiked: boolean; isPending: boolean }>

// actions
handleLike(slug) → optimistic update → API call → onSuccess sync / onError rollback
```

- `atomFamily`는 slug를 key로 atom 인스턴스를 자동 생성/캐싱
- 낙관적 업데이트 + 에러 롤백 로직을 store action으로 이동
- `localStorage`(`liked_${slug}`) 읽기/쓰기는 store action 내부에서 처리

## `PostMetricsDisplay` 변경

- `usePostMetrics` hook의 `likes` state → `likesAtomFamily(slug)` atom으로 교체
- `views` 상태와 view increment 로직은 기존 유지 (likes와 분리)
- view increment 응답에서 받은 `likes` 값으로 atom 초기화 (최초 1회)

## ISR Fix

```ts
// api.ts
export async function getPost(slug: string) {
  return apiFetch<ApiPostDetail>(`/api/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },  // 600 → 60
  });
}
```

## Dependencies

```
pnpm add jotai   # apps/web workspace
```

Jotai는 `atomFamily` 포함 기본 패키지에 내장. 추가 패키지 불필요.

## Out of Scope

- `PostMetricsDisplay`의 views 카운트 로직 변경 없음
- 다른 페이지(알고리즘 등) likes 상태 관리 변경 없음
- 서버 사이드 likes 로직 변경 없음
