---
paths:
  - "apps/*/src/**/*.{ts,tsx,mdx,css}"
  - "packages/*/src/**/*.{ts,tsx,mdx,css}"
  - "apps/*/next.config.{ts,js,mjs}"
  - "apps/*/postcss.config.{js,mjs}"
---

# Next.js App Router 기본 규칙

- `apps/web`와 `apps/admin`의 Next.js 16 App Router, React 19, TypeScript strict 구성을 기준으로 작성한다.
- 두 앱은 `cacheComponents: true`를 사용한다. 정적 UI, `"use cache"`로 명시한 공개 데이터, Suspense 안에서 처리하는 요청별 데이터를 구분한다.
- UI 구현 전에 `docs/frontend-spec.md`를 읽고 기능, 상태, 문구, 화면 흐름을 확인한다.
- 코드 작성, 수정, 리뷰 전에 `docs/frontend-code-quality.md`와 `docs/frontend_clean_code_guide.md`의 관련 기준을 확인한다.
- 참고 문서의 React SPA 예시를 그대로 적용하지 않는다. 서버/클라이언트 경계, 라우팅, 데이터 조회는 이 Next.js 규칙과 해당 앱의 실제 구성을 기준으로 판단한다.
- 명세에 없는 사용자 기능은 추가하지 않는다.
- 기존 프로젝트의 디렉토리 구조, 컴포넌트 패턴, 명명 규칙을 우선 따른다.
- `src/app`의 파일 기반 라우팅을 사용한다. Pages Router의 `getServerSideProps`, `getStaticProps`, `next/router`나 별도의 SPA 라우터를 추가하지 않는다.
- 스타일링은 Tailwind CSS 유틸리티와 Tailwind 테마 변수만 사용한다.
- 페이지와 레이아웃은 Server Component를 기본으로 유지하고, 상호작용이 필요한 작은 경계에만 `"use client"`를 선언한다.
- 초기 데이터 조회는 Server Component에서 기존 도메인 API 함수를 호출하는 방식을 우선한다. TanStack Query는 클라이언트 재조회, 폴링, 낙관적 업데이트 등이 필요한 영역에 사용한다.
- 요청 범위와 관계없는 코드 정리나 리팩터링을 함께 수행하지 않는다.

기준: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
