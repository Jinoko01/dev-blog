---
paths:
  - "apps/*/src/**/*.{ts,tsx,mdx}"
  - "packages/*/src/**/*.{ts,tsx,mdx}"
---

# Next.js 컴포넌트 경계 및 상태 관리

## Server / Client Component 경계

- 데이터 조회, 비밀 정보 접근, 정적 콘텐츠 렌더링은 Server Component에 둔다.
- state, 이벤트 핸들러, Effect, 브라우저 API가 필요한 부분만 Client Component로 분리한다. Client Component는 `async` 함수로 작성하지 않는다.
- `"use client"` 파일이 import하는 모듈도 클라이언트 번들에 포함될 수 있으므로 서버 전용 모듈을 import하지 않는다.
- Client Component 안에 서버 렌더링 콘텐츠가 필요하면 서버 부모에서 생성해 `children` 등의 props로 전달한다.
- 서버에서 클라이언트로 전달하는 props는 React가 직렬화할 수 있는 최소한의 데이터로 제한한다. 일반 함수나 클래스 인스턴스를 넘기지 않으며, Server Action 참조는 허용된 예외다.
- Context 및 Query Provider는 Client Component로 만들고 필요한 하위 트리만 감싼다. Provider 사용을 위해 루트 레이아웃 전체를 Client Component로 바꾸지 않는다.
- Client Component도 초기 HTML을 서버에서 렌더링할 수 있다. `window`, `localStorage`, 현재 시각, 난수 등에 의존해 서버와 클라이언트의 첫 렌더 결과를 다르게 만들지 않는다.

## 상태 분류

- 상태를 추가하기 전에 서버 상태, URL 상태, 폼 상태, 로컬 UI 상태, 기존 값에서 계산 가능한 파생 상태 중 어디에 해당하는지 판단한다.
- props나 기존 상태에서 계산할 수 있는 값은 별도 state로 저장하지 말고 렌더링 중 계산한다.
- 동일한 데이터를 여러 state에 중복 저장하지 않고 단일 진실 공급원을 유지한다.
- 공유하거나 새로고침 후에도 유지되어야 하는 검색어, 정렬, 필터, 페이지 번호는 가능한 한 URL 상태로 관리한다.
- 서버 페이지에서는 비동기 `searchParams` prop을 읽고, 클라이언트에서는 `next/navigation`의 `useSearchParams`, `usePathname`, `useRouter`를 사용한다.
- 정적 렌더링 경로에서 `useSearchParams`를 사용하는 Client Component는 상위 `Suspense` 경계로 감싼다. 개발 모드에서 동작하더라도 프로덕션 빌드 제약을 확인한다.
- Cache Components에서 사전 생성하지 않은 동적 `params`를 읽는 컴포넌트와, 동적 경로의 `usePathname`/`useParams`를 사용하는 UI에는 필요한 상위 Suspense 경계를 둔다. 부모에서 먼저 `params`를 기다린 다음 자식에 Suspense를 추가하지 않는다.

## 서버 상태와 폼 상태

- 서버에서 조회한 데이터를 단순히 표시하기 위해 Query 캐시나 로컬 state에 복제하지 않는다.
- 폼 중심의 변경은 Server Action을 검토하고, 기존 클라이언트 Query 흐름에서의 변경은 `useMutation`을 사용한다. 동일한 요청을 두 방식으로 중복 관리하지 않는다.
- Server Action 폼은 `useActionState`의 반환 상태와 pending 값을 사용한다. `useFormStatus`는 상태를 읽을 `<form>`의 자식 컴포넌트에서 사용한다.
- Query 요청 상태는 `isPending`, 오류 상태는 `error` 등 Query/Mutation이 제공하는 값을 사용한다.
- 낙관적 UI는 상태 소유자에 맞게 선택한다. Query 캐시는 `onMutate`와 롤백/무효화를 사용하고, Action 기반 UI는 `useOptimistic`을 검토한다.

## Hook 선택

- 아래 state, Effect 및 이벤트 관련 Hook 규칙은 Client Component와 클라이언트 Hook에 적용한다. Server Component의 조회는 `async`/`await`로 처리한다.
- Hook이 최신이라는 이유만으로 사용하지 말고, 해결하려는 문제의 의미와 생명주기에 맞는 Hook을 선택한다.
- 상태를 `useState`로 직접 관리하기 전에 같은 문제를 더 적절하게 해결하는 React Hook이 있는지 검토한다.
- `useEffect`는 외부 시스템과의 동기화에만 사용한다.
- 파생 값 계산, 사용자 이벤트 처리, 서버 데이터 요청을 위해 `useEffect`를 사용하지 않는다.
- 사용자 동작으로 발생하는 로직은 가능한 한 이벤트 핸들러에서 처리한다.
- `useTransition`은 긴급하지 않은 렌더링 업데이트를 비차단 방식으로 처리할 때만 사용한다.
- `useDeferredValue`는 입력 자체가 아니라 입력에 따라 갱신되는 비용이 큰 UI를 지연할 때 검토한다.
- `use()`는 서버에서 전달한 Promise 등 안정적인 리소스를 Suspense 경계 안에서 읽을 때 사용한다. 클라이언트 렌더 중 매번 새 요청 Promise를 만들지 않는다.
- `useMemo`, `useCallback`, `memo`는 습관적으로 추가하지 않고 연산 비용이나 참조 동일성이 실제로 필요한 경우에만 사용한다.

기준: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params).
