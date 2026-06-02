# 게시물 좋아요 공유 상태 — 설계 스펙

**날짜:** 2026-06-02  
**상태:** 승인됨

## 문제

`PostMetricsDisplay` (헤더)와 `PostLikeButton` (댓글 영역)이 각각 독립된 `likes` 상태를 가집니다. 댓글 위 좋아요 버튼을 클릭해도 헤더의 좋아요 수가 업데이트되지 않습니다. 또한 `getPost` fetch 캐시(600초)가 페이지 ISR 주기(60초)와 맞지 않아 페이지 새로고침 후 `initialLikes` 값이 오래된 값으로 표시됩니다.

## 해결 방향

컴포넌트별 로컬 `likes` state를 **Jotai `atomFamily`** (slug별 격리)로 교체합니다.

1. 두 컴포넌트가 동일한 atom을 읽고 쓰므로 항상 동기화됩니다.
2. slug 전환 시 별도 reset 로직 없이 atom이 자동 격리됩니다. (PR #30 버그 재발 방지)

## 아키텍처

### 신규 파일

```
apps/web/src/store/
  post-metrics.ts     # atomFamily 정의 + 좋아요 액션
```

### 수정 파일

```
apps/web/src/components/
  post-metrics.tsx    # 로컬 state → useAtom(likesAtomFamily(slug)) 로 교체
apps/web/src/app/posts/[slug]/page.tsx  # JotaiProvider 감싸기
apps/web/src/lib/api.ts                 # getPost revalidate 600 → 60
```

## 데이터 흐름

```
page.tsx (서버 컴포넌트)
  └─ <JotaiProvider>          ← Next.js App Router 격리용
       ├─ PostMetricsDisplay
       │    └─ useAtom(likesAtomFamily(slug))   → likes 읽기만
       └─ GiscusComments
            └─ PostLikeButton
                 └─ useAtom(likesAtomFamily(slug))   → likes 읽기 + 쓰기
```

## 스토어 설계 (`store/post-metrics.ts`)

```ts
// atom 구조
likesAtomFamily(slug: string) → atom<{ likes: number; isLiked: boolean; isPending: boolean }>

// 액션
handleLike(slug) → 낙관적 업데이트 → API 호출 → 성공 시 서버값 동기화 / 실패 시 롤백
```

- `atomFamily`는 slug를 key로 atom 인스턴스를 자동 생성 및 캐싱
- 낙관적 업데이트 + 에러 롤백 로직을 스토어 액션으로 이동
- `localStorage`(`liked_${slug}`) 읽기/쓰기는 스토어 액션 내부에서 처리

## PostMetricsDisplay 변경

- `usePostMetrics` hook의 `likes` state → `likesAtomFamily(slug)` atom으로 교체
- `views` 상태 및 view increment 로직은 기존 유지 (likes와 분리)
- view increment 응답에서 받은 `likes` 값으로 atom 초기화 (최초 1회)

## ISR 버그 수정

```ts
// api.ts
export async function getPost(slug: string) {
  return apiFetch<ApiPostDetail>(`/api/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },  // 600 → 60 으로 변경
  });
}
```

## 의존성

```
pnpm add jotai   # apps/web 워크스페이스
```

`atomFamily`는 jotai 기본 패키지에 포함되어 있어 추가 패키지 불필요합니다.

## 범위 외

- `PostMetricsDisplay`의 views 카운트 로직 변경 없음
- 알고리즘 등 다른 페이지의 likes 상태 관리 변경 없음
- 백엔드 likes 로직 변경 없음
