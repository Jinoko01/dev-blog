---
paths:
  - "apps/*/src/**/*.{ts,tsx}"
  - "packages/*/src/**/*.{ts,tsx}"
---

# TypeScript 및 App Router 파일 구조

## TypeScript

- `strict` 설정을 기준으로 타입 오류 없이 작성한다.
- 명시적인 사유 없이 `any`, `@ts-ignore`, `@ts-expect-error`, non-null assertion(`!`)을 사용하지 않는다.
- 외부에서 전달되는 값은 `unknown`으로 받은 뒤 타입을 좁혀 사용한다.
- 타입 단언으로 오류를 숨기기보다 타입 가드, 스키마 검증 또는 타입 구조 개선으로 해결한다.
- API 요청 DTO, 응답 DTO, 화면에서 사용하는 모델의 역할이 다르면 타입을 구분한다.
- 컴포넌트 props와 함수 반환 타입은 추론이 명확하지 않은 경계에서 명시한다.
- 가능한 상태의 조합이 제한된 경우 임의의 `string`보다 유니온 타입이나 판별 유니온을 우선한다.
- 동적 경로의 `params`와 페이지의 `searchParams`는 Promise 타입으로 정의해 서버에서 `await`한다. 필요하면 Next.js가 생성하는 `PageProps`, `LayoutProps`, `RouteContext`를 사용한다.

## 컴포넌트 책임

- 컴포넌트는 하나의 명확한 책임을 갖도록 작성한다.
- 페이지 컴포넌트에 데이터 처리와 복잡한 UI 로직을 집중시키지 않는다.
- 한 곳에서만 사용하는 작은 로직은 가까운 위치에 둔다.
- 재사용 가능성이 확인된 경우에만 공통화한다.
- 동일한 코드가 보인다는 이유만으로 성급하게 추상화하지 않는다.

## App Router 규약

- URL과 화면 구성은 `src/app`의 `page.tsx`, `layout.tsx`, route group 및 동적 세그먼트 규약을 따른다. 새 SPA 엔트리나 수동 라우트 테이블을 만들지 않는다.
- 공통 UI는 `layout.tsx`, 탐색마다 새로 마운트해야 하는 UI만 `template.tsx`를 검토한다.
- 루트 레이아웃에 `<html>`과 `<body>`를 유지하고, 클라이언트 Provider와 상호작용 UI는 별도 컴포넌트로 합성한다.
- 로딩, 오류, 없는 리소스는 `loading.tsx`, `error.tsx`, `not-found.tsx` 등 해당 경로의 특수 파일로 처리한다.
- 문서 제목과 SEO 정보는 Server Component의 `metadata` 또는 `generateMetadata`로 정의한다. Client Component에서 metadata를 export하거나 `next/head`를 추가하지 않는다.
- 요청 전 분기가 필요하면 Next.js 16의 `src/proxy.ts` 규약을 사용한다. Proxy를 유일한 인증/인가 계층으로 사용하지 않는다.

## 파일 배치

- 여러 컴포넌트에서 재사용하는 순수 함수는 `lib` 디렉토리에 분리한다.
- 여러 컴포넌트에서 재사용하는 커스텀 Hook은 `hooks` 디렉토리에 분리한다.
- 도메인에 종속된 함수나 Hook은 전역 `lib`, `hooks`가 아니라 해당 도메인 디렉토리에 둔다.
- 특정 경로에서만 사용하는 UI와 로직은 해당 경로 가까이에 둔다. 필요하면 `_components`, `_lib` 같은 private folder로 라우트 파일과 구분한다.
- 서버 전용 API/인증 모듈과 클라이언트 Hook의 import 경계를 분리한다. 공용 barrel export로 서버 전용 모듈이 클라이언트에 섞이지 않게 한다.
- 하나의 파일 안에서만 사용하는 하위 컴포넌트는 불필요하게 별도 파일로 분리하지 않는다.
- 기존 공개 API와 export 구조를 요청 없이 변경하지 않는다.
- 순환 참조를 만들지 않는다.

## 주석

- 커스텀 Hook, 함수, 파일 내부 컴포넌트 영역을 구분하는 용도 외에는 주석을 추가하지 않는다.
- 코드 동작을 설명하는 주석이 필요해지는 경우, 먼저 코드의 이름과 구조를 명확하게 개선한다.
- 임시 코드, 비활성화된 코드, 당연한 내용을 설명하는 주석을 남기지 않는다.

기준: [Next.js 16 변경 사항](https://nextjs.org/docs/app/guides/upgrading/version-16).
