# 게시물 좋아요 공유 상태 + API 프록시 Route Handler — 설계 스펙

**날짜:** 2026-06-02  
**상태:** 승인됨

## 문제

1. `PostMetricsDisplay` (헤더)와 `PostLikeButton` (댓글 영역)이 독립된 `likes` state를 가져 동기화되지 않음
2. `getPost` fetch 캐시(600초)가 페이지 ISR 주기(60초)와 맞지 않아 새로고침 후 `initialLikes`가 오래된 값으로 표시됨
3. 좋아요 클릭 후 새로고침 시 최신 likes 수가 즉시 반영되지 않음
4. 프론트엔드가 Spring Boot 백엔드를 직접 호출해 Next.js 캐시 제어 불가

## 해결 방향

### 1. Next.js Catch-all Route Handler (API 프록시)

모든 API 요청을 Next.js Route Handler를 통해 Spring Boot로 프록시합니다.

```
브라우저 → Next.js /api/[...path]/route.ts → Spring Boot
```

- **GET 요청**: `fetch` 태그를 붙여 캐시. 리소스별 태그 설정.
- **변경 요청 (POST/DELETE)**: Spring Boot 호출 후, 관련 태그를 `revalidateTag`로 즉시 무효화.

### 2. Jotai atomFamily로 likes 공유 상태 관리

`PostMetricsDisplay`와 `PostLikeButton`이 동일한 Jotai atom을 공유합니다.

## 아키텍처

### 신규 파일

```
apps/web/src/app/api/[...path]/
  route.ts          # catch-all 프록시 핸들러

apps/web/src/store/
  post-metrics.ts   # likesAtomFamily 정의 + 좋아요 액션
```

### 수정 파일

```
apps/web/src/lib/api.ts
  - apiFetch 호출 URL을 Spring Boot → Next.js /api/... 로 변경
  - getPost fetch에 revalidateTag용 태그 추가
  - getPost revalidate: 600 → 60

apps/web/src/components/post-metrics.tsx
  - 로컬 likes state → useAtom(likesAtomFamily(slug)) 로 교체

apps/web/src/app/posts/[slug]/page.tsx
  - JotaiProvider 감싸기
```

## Route Handler 설계 (`app/api/[...path]/route.ts`)

```ts
// GET: Spring Boot로 포워딩 + fetch 태그 캐싱
export async function GET(req, { params }) {
  const path = params.path.join("/");
  const tag = resolveTag(path); // 예: 'post-my-slug', 'posts', 'algorithms'
  return fetch(`${BACKEND_URL}/api/${path}`, {
    next: { revalidate: 60, tags: [tag] },
  });
}

// POST/DELETE: Spring Boot로 포워딩 + revalidateTag
export async function POST(req, { params }) {
  const path = params.path.join("/");
  const res = await fetch(`${BACKEND_URL}/api/${path}`, {
    method: "POST",
    body: await req.text(),
    headers: { "Content-Type": "application/json" },
  });
  revalidateTag(resolveTag(path));
  return res;
}

export async function DELETE(req, { params }) {
  /* 동일 패턴 */
}
```

### 태그 전략 (`resolveTag`)

| 경로 패턴          | 태그                           |
| ------------------ | ------------------------------ |
| `posts`            | `posts`                        |
| `posts/:slug`      | `post-{slug}`                  |
| `posts/:slug/view` | `post-{slug}`                  |
| `posts/:slug/like` | `post-{slug}`                  |
| `algorithms`       | `algorithms`                   |
| `algorithms/:id`   | `algorithm-{id}`               |
| `articles`         | `articles`                     |
| `tags`             | `tags`                         |
| `stats`            | `stats`                        |
| `visits`           | (태그 없음, revalidate 불필요) |

## Jotai 스토어 설계 (`store/post-metrics.ts`)

```ts
// slug별 atom 인스턴스 자동 생성/격리
likesAtomFamily(slug) → atom<{ likes: number; isLiked: boolean; isPending: boolean }>

// 액션: 낙관적 업데이트 → API 호출 → 성공 시 서버값 동기화 / 실패 시 롤백
```

- `localStorage`(`liked_${slug}`) 읽기/쓰기는 스토어 액션 내부 처리
- slug 전환 시 atom 자동 격리 (PR #30 버그 재발 방지)

## `api.ts` 변경

```ts
// 변경 전
async function apiFetch(path, options) {
  fetch(`${NEXT_PUBLIC_API_BASE_URL}${path}`, ...)
}

// 변경 후
async function apiFetch(path, options) {
  fetch(`/api${path}`, ...)   // Next.js Route Handler로 라우팅
}
```

서버 컴포넌트에서 호출 시 절대 URL이 필요하므로, 서버/클라이언트 환경에 따라 base URL을 분기합니다.

```ts
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // 클라이언트: 상대 경로
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"; // 서버: 절대 경로
}
```

## 의존성

```
pnpm add jotai   # apps/web 워크스페이스
```

## 범위 외

- admin 앱 API 호출 변경 없음
- Spring Boot 백엔드 코드 변경 없음
- 알고리즘 페이지 likes 상태 관리 변경 없음 (posts만 적용)
