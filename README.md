# OKOJIN 개발 블로그

프론트엔드 개발자인 OKOJIN의 기술 블로그이자 알고리즘 풀이 아카이브입니다. 방문자가 글을 읽는 공개 사이트(`apps/web`)와, 운영자가 글을 작성·관리하는 어드민(`apps/admin`)으로 구성된 pnpm 모노레포입니다.

## 개요

이 저장소는 프론트엔드만 포함합니다. 게시글·알고리즘 데이터는 별도로 운영되는 Spring Boot REST API가 관리하며, 두 앱 모두 이 API를 통해서만 데이터에 접근합니다.

- **`apps/web`**: 방문자용 블로그. 글 목록/상세, 태그 검색, 알고리즘 풀이 아카이브를 제공합니다.
- **`apps/admin`**: 운영자 전용 CMS. 로그인 후 게시글·알고리즘을 작성·수정·발행합니다.

## 주요 기능

### 블로그 (apps/web)

- **아티클**: 태그·검색어·정렬(최신순/인기순) 기준으로 글을 탐색 (`/articles`)
- **글 상세**: MDX 렌더링, 코드 하이라이팅(Shiki), 목차(TOC), 조회수·좋아요, Giscus 댓글 (`/posts/[slug]`)
- **알고리즘 아카이브**: 문제별 플랫폼·난이도·언어·풀이 코드 열람, 난이도 기준 검색 (`/algorithm`)
- **다크 모드**, 방문자 수 집계, 랜딩 페이지(자기소개·기술 스택·최신 글)

### 어드민 (apps/admin)

- **인증**: 아이디/비밀번호 로그인 → JWT 발급, 이후 요청에 `Authorization: Bearer` 헤더로 첨부 (`AuthGuard`가 미인증 접근 차단)
- **게시글 관리**: 목록 조회, 작성/수정, 발행 상태 토글, 삭제, 마크다운 본문에 이미지 드래그·붙여넣기 업로드
- **알고리즘 관리**: 목록 조회, 작성/수정, 발행 상태 토글, 삭제

## 시스템 구조

```
apps/web    (공개, 인증 불필요)  ──┐
                                    ├──▶  Spring Boot API  ──▶  Supabase PostgreSQL
apps/admin  (JWT 인증 필요)     ──┘        (별도 저장소·서버)  ──▶  Supabase Storage (이미지)
```

- `apps/web`은 서버 컴포넌트에서 API를 직접 호출하고, 클라이언트에서 발생하는 변경(좋아요 등)은 Next.js Route Handler(`apps/web/src/app/api/[...path]/route.ts`)를 경유해 `revalidateTag`로 캐시를 즉시 무효화합니다.
- `apps/admin`은 브라우저에서 API를 직접 호출하며, JWT는 `localStorage`에 저장합니다.
- 이미지는 Spring API가 발급한 서명 URL로 Supabase Storage에 직접 업로드합니다.
- Spring Boot API 서버 자체는 이 저장소에 포함되어 있지 않습니다.

## 기술 스택 및 개발 환경

### 프론트엔드

| 구분 | 스택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript (strict) |
| 스타일링 | Tailwind CSS v4, shadcn/ui, Framer Motion |
| 콘텐츠 | MDX (`next-mdx-remote`), Shiki, rehype-pretty-code |
| 상태·데이터 | Jotai, TanStack Query |
| 컴포넌트 개발·테스트 | Storybook 10 (`@storybook/nextjs-vite`), Vitest + Playwright(interaction test) |
| 린트·포맷 | ESLint 9 (flat config), Prettier |

### 모노레포

- **패키지 매니저**: pnpm workspaces (`pnpm@10.0.0`)
- **태스크 러너**: Turborepo

### 시작하기

```bash
pnpm install

# 개발 서버
pnpm dev              # web(:3000), admin(:3001) 동시 실행 (turbo)

# Storybook
pnpm storybook        # web(:6006), admin(:6007) 동시 실행 (turbo)

# 린트
pnpm lint
```

앱별로 실행하려면 `pnpm --filter web dev`, `pnpm --filter admin dev`처럼 `--filter`를 사용합니다.

## 주요 화면

### 웹 (apps/web)

| 경로 | 화면 |
| --- | --- |
| `/` | 랜딩 페이지 — 자기소개, 기술 스택, 최신 글 목록, 방문자·글·알고리즘 통계 |
| `/articles` | 전체 글 목록 — 태그 필터, 검색, 정렬(최신순/인기순) |
| `/posts/[slug]` | 글 상세 — MDX 본문, 목차, 조회수/좋아요, Giscus 댓글 |
| `/algorithm` | 알고리즘 아카이브 — 플랫폼·난이도별 목록, 검색, 페이지네이션 |
| `/algorithm/[slug]` | 알고리즘 상세 — 풀이 코드, 설명 |
| `/about` | 소개 페이지 (현재 상단 내비게이션에는 노출되지 않음) |

### 어드민 (apps/admin)

| 경로 | 화면 |
| --- | --- |
| `/login` | 로그인 |
| `/` | 대시보드 — 통계 카드(예시 값), 최근 활동(미연동) |
| `/posts` | 게시글 목록 — 발행 상태 토글, 삭제 |
| `/posts/new`, `/posts/[id]/edit` | 게시글 작성·수정 — 제목/설명/태그/썸네일/마크다운 본문(이미지 업로드 지원) |
| `/algorithms` | 알고리즘 목록 — 발행 상태 토글, 삭제 |
| `/algorithms/new`, `/algorithms/[id]/edit` | 알고리즘 작성·수정 — 플랫폼/난이도/언어/풀이 코드 |
