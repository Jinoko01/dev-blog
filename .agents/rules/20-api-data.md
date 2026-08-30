---
paths:
  - "apps/*/src/**/*.{ts,tsx}"
  - "packages/*/src/**/*.{ts,tsx}"
  - "apps/*/next.config.{ts,js,mjs}"
---

# Next.js 데이터 조회, 변경 및 캐시

## 호출 계층

- 기존 앱별 `src/lib/api.ts`와 도메인 API 함수의 계약을 우선 따른다. `docs/api-guide.md`의 SPA용 `src/api/client.ts`/axios 계층을 일괄 도입하지 않는다.
- 서버 조회는 `Server Component → 도메인 API 함수 → Spring Boot API` 흐름을 우선한다. 서버 페이지에서 도메인 API 함수를 직접 호출할 수 있다.
- web의 공개 서버 조회는 `src/lib/api.server.ts`의 캐시 함수를 사용한다. 공유 `src/lib/api.ts`는 전송과 응답 변환을 담당하며, 클라이언트 코드에서 `api.server.ts`나 `next/cache`를 import하지 않는다.
- Server Component에서 자기 앱의 `/api` Route Handler를 HTTP로 다시 호출하지 않는다. 서버용 API 주소로 데이터 원본에 접근해 불필요한 왕복과 빌드 시 자기 서버 호출을 피한다.
- 클라이언트 재조회가 필요한 영역은 `Client Component → Query Hook/Options → 도메인 API 함수` 흐름을 사용한다. 브라우저 요청 경로는 해당 앱의 기존 API 연결 방식을 따른다.
- 인증 정보 처리와 응답 변환은 API 계층에 두고, JSX나 이벤트 핸들러에 통신 세부 구현을 반복하지 않는다.

## 서버 조회와 스트리밍

- 서버에서 필요한 데이터는 `async` Server Component에서 조회한다. 조회를 위해 `"use server"`를 붙이지 않는다. 이 지시문은 Server Function 경계를 선언할 때 사용한다.
- 독립적인 요청은 병렬로 시작하고 `Promise.all` 또는 별도 컴포넌트로 처리한다. 선행 결과가 필요한 요청은 순서를 유지한다.
- 느린 영역은 `Suspense` 또는 경로의 `loading.tsx`로 분리한다. 경계보다 상위에서 모든 요청을 기다려 스트리밍을 막지 않는다.
- Next.js 16의 `params`, 페이지 `searchParams`, `cookies()`, `headers()`, `draftMode()`는 비동기로 읽는다.

## 서버 캐시와 재검증

- 두 앱의 `cacheComponents: true`를 전제로 한다. 공개 데이터를 재사용할 서버 함수/컴포넌트에 `"use cache"`를 선언하고 같은 범위에서 `cacheLife`와 `cacheTag`를 지정한다. 활성화만으로 모든 조회가 캐시되는 것은 아니다.
- route segment의 `export const revalidate`, `dynamic`, `fetchCache`를 추가하지 않는다. 서버 캐시는 `cacheLife`로 관리하고, 기존 `fetch`의 `next.revalidate`/`next.tags` 정책을 옮길 때에는 중복된 캐시 계층이 남지 않는지 확인한다.
- 현재 web 공개 목록·태그·통계·게시글은 `cacheLife({ revalidate: 60 })`, 알고리즘 상세는 `cacheLife({ revalidate: 3600 })`를 사용한다. 새 수명은 데이터 요구사항에 따라 정하며 `expire`를 지정하면 `revalidate`보다 길게 둔다. `stale`은 클라이언트 재사용 시간이며 서버 재검증 주기와 구분한다.
- 캐시 함수의 인자와 반환값은 React가 직렬화할 수 있어야 한다. 필터, 페이지, slug 등 결과를 바꾸는 값은 인자로 전달해 캐시 키에 포함하고, Request/Response 객체나 인증 토큰을 공용 캐시로 넘기지 않는다.
- 캐시 경계를 지난 오류의 커스텀 클래스나 속성이 보존된다고 가정하지 않는다. 404처럼 예상 가능한 실패는 캐시 함수 안에서 식별해 `null` 등 명시적인 결과로 반환하고, 호출부에서 `notFound()` 등으로 처리한다.
- `cookies()`, `headers()`, `draftMode()`, 요청의 `searchParams`를 `"use cache"` 내부에서 읽지 않는다. 필요한 공개 필터 값은 캐시 바깥의 Suspense 하위 컴포넌트에서 읽고 검증한 뒤 인자로 전달한다.
- 사용자별 인증 데이터와 매 요청 최신 값이 필요한 조회는 캐시 범위 밖에 두고 상위 Suspense로 감싼다. `fetch`에 `no-store`를 붙여도 바깥 `"use cache"`의 결과 캐싱을 해제하는 수단으로 사용하지 않는다.
- 관리자 인증·개인 데이터와 변경 함수에 `"use cache"`를 선언하지 않는다. `use cache: private`/`remote`는 별도 설정과 운영 요구사항을 확인하지 않고 도입하지 않는다.
- React `cache()`는 서버 렌더 요청 내 중복 제거용이며 요청 간 영속 캐시와 구분한다.
- 캐시 함수에 `cacheTag`로 태그를 지정한다. 변경 성공 후 상세와 관련 목록 등 실제로 영향을 받은 태그 또는 경로만 갱신하고, 실패한 변경 요청으로 캐시를 무효화하지 않는다.
- 오래된 값을 잠시 제공해도 되는 데이터에는 `revalidateTag(tag, "max")`를 사용한다. Server Action에서 변경 직후 최신 값이 필요하면 `updateTag(tag)`를 사용하며, Route Handler에서 `updateTag`를 호출하지 않는다.
- `revalidatePath`는 관련 경로를 갱신할 때 사용한다. `router.refresh()`만으로 서버 Data Cache가 무효화된다고 가정하지 않는다.
- Next.js 서버 캐시와 TanStack Query 캐시는 별개다. 동일한 데이터가 양쪽에 있다면 변경 후 각각의 갱신을 처리한다.
- 앱별 배포의 캐시도 별개다. admin이나 Spring Boot에서 수정했다고 web 캐시가 자동 갱신된다고 가정하지 않으며, 즉시 반영이 필요하면 인증된 web 재검증 연동을 별도로 설계한다.
- `generateStaticParams`를 사용하면 실제 데이터로 최소 한 개의 params를 반환해야 한다. 빈 데이터 대응을 위해 가짜 slug를 만들지 말고, 사전 생성이 불필요하면 함수 없이 요청 시 params를 Suspense 안에서 읽는다.

## Server Actions와 Route Handlers

- Server Action은 폼 제출 등 UI에서 발생한 변경에 사용하고, 조회용 API를 대체하지 않는다.
- 브라우저용 HTTP API, 웹훅, 외부 서비스 연동이 필요한 경우 `src/app/**/route.ts`를 사용한다. 같은 경로에 `page.tsx`와 `route.ts`를 함께 두지 않는다.
- Server Action과 Route Handler는 각각 요청 입력, 인증, 리소스 권한을 서버에서 검증한다. 비즈니스 규칙과 최종 권한 검증은 Spring Boot API에서도 유지한다.
- Action/Handler에서 요청별 인증 정보나 사용자 데이터를 모듈 전역 변수에 저장하지 않는다.

## 클라이언트 Query

- TanStack Query가 설치되고 Provider가 구성된 영역에 적용한다. 서버 조회만으로 충분한 페이지나 Query가 없는 앱에 라이브러리를 강제하지 않는다.
- `useEffect`와 `useState`를 조합해 서버 요청 결과를 보관하지 않는다.
- 조회 요청은 도메인별 `xxxKeys` 팩토리와 `queryOptions` 팩토리로 정의한다.
- Query Key에 영향을 주는 모든 입력값을 Query Key에 포함한다.
- Query Key에는 직렬화 가능한 값만 사용한다.
- Query 함수에서 전달받은 `AbortSignal`을 API 클라이언트까지 전달해 불필요해진 요청을 취소할 수 있도록 한다.
- 동일한 요청의 `staleTime`, `gcTime`, `retry` 정책을 컴포넌트마다 임의로 다르게 지정하지 않고 Options 팩토리에 정의한다.
- 서버에서 Query를 prefetch할 때는 요청마다 QueryClient를 만들고 `dehydrate`/`HydrationBoundary`로 전달한다. 사용자 간 서버 QueryClient를 공유하지 않으며 브라우저에서는 안정적인 인스턴스를 유지한다.

## 클라이언트 Mutation

- 변경 요청은 도메인별 Mutation 함수와 `mutationOptions` 팩토리로 정의한다.
- Mutation 성공 후 서버 응답으로 캐시를 직접 갱신할지, 관련 쿼리를 무효화할지 명확히 결정한다.
- 낙관적 업데이트를 적용한 경우 오류 발생 시 이전 캐시 상태로 롤백한다.
- 인증, 권한, 검증 오류처럼 재시도로 해결되지 않는 오류를 무조건 재시도하지 않는다.
- 요청 중 동일한 작업이 중복 실행되지 않도록 제출 및 상호작용 상태를 제어한다.

기준: [Cache Components 마이그레이션](https://nextjs.org/docs/app/guides/migrating-to-cache-components), [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache), [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag).
