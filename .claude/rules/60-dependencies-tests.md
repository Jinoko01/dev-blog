---
paths:
  - "package.json"
  - "pnpm-lock.yaml"
  - "pnpm-workspace.yaml"
  - "turbo.json"
  - "eslint.config.{js,mjs,ts}"
  - "apps/*/package.json"
  - "apps/*/pnpm-lock.yaml"
  - "packages/*/package.json"
  - "apps/*/next.config.{ts,js,mjs}"
  - "apps/*/eslint.config.{js,mjs,ts}"
  - "apps/*/tsconfig*.json"
  - "packages/*/tsconfig*.json"
  - "apps/*/vitest.config.{ts,js,mjs}"
  - "apps/*/.storybook/**/*.{ts,tsx,js,mjs}"
  - "apps/*/src/**/*.test.{ts,tsx}"
  - "apps/*/src/**/*.spec.{ts,tsx}"
  - "apps/*/src/**/*.stories.{ts,tsx}"
  - "packages/*/src/**/*.test.{ts,tsx}"
  - "packages/*/src/**/*.spec.{ts,tsx}"
  - "apps/*/tests/**/*.{ts,tsx}"
  - "tests/**/*.{ts,tsx}"
  - "scripts/*.test.mjs"
---

# Next.js 의존성, 설정 및 테스트

## 의존성

- 패키지 작업은 `pnpm`으로만 수행한다.
- lockfile을 직접 수정하지 않는다.
- 이미 설치된 라이브러리로 해결 가능한 문제에 동일한 목적의 새 라이브러리를 추가하지 않는다.
- 새로운 패키지 설치, 기존 패키지 제거, 주요 버전 변경 전에는 확인을 요청한다.
- 오류를 없애기 위해 ESLint 또는 TypeScript 규칙을 비활성화하거나 완화하지 않는다.

## Next.js 설정과 검증 명령

- 앱별 `next.config.ts`, ESLint 설정, `tsconfig.json`과 루트 Turborepo 구성을 먼저 확인한다. `apps/web`와 `apps/admin`의 의존성 및 설정이 동일하다고 가정하지 않는다.
- Next.js와 `eslint-config-next`, React와 React DOM의 버전 호환성을 유지한다. `.next`, `next-env.d.ts` 등 생성 파일을 직접 수정하지 않는다.
- Next.js 16의 기본 번들러는 Turbopack이다. 앱 설정에 Vite 구성을 추가하지 않고, 기존 Storybook/Vitest의 Vite 사용은 별개로 유지한다.
- 두 앱의 `cacheComponents: true`를 유지한다. 빌드 오류를 숨기기 위해 끄거나 `experimental.ppr`로 대체하지 않는다. Node.js 런타임을 사용하며 Edge 런타임과 정적 `output: "export"`를 함께 사용하지 않는다.
- 코드 변경 후 루트에서 `pnpm lint` 또는 해당 앱 디렉토리에서 `pnpm lint`를 실행한다. Next.js 16에서는 `next lint`를 사용하지 않으며 `next build`가 ESLint 검사도 실행한다고 가정하지 않는다.
- 포맷 문제는 `pnpm format`으로 정리하되, 요청과 무관한 파일의 변경을 포함하지 않는다.
- 라우팅, RSC 경계, 캐시, metadata, Next.js 설정 변경은 해당 앱의 `pnpm build`로 검증한다. 개발 서버에서 정상이라는 이유만으로 빌드 검증을 생략하지 않는다.

## 테스트

- 변경된 사용자 동작과 오류 처리에 기존 테스트 방식이 있다면 테스트를 추가하거나 수정한다.
- 테스트는 내부 구현 세부 사항보다 사용자가 확인할 수 있는 동작을 검증한다.
- 성공 경로뿐 아니라 로딩, 빈 상태, 오류, 권한 부족, 중복 제출 방지 경로를 검토한다.
- Next.js 기능 변경 시 직접 URL 진입, 클라이언트 탐색, 새로고침, hydration, 변경 후 서버/클라이언트 캐시 갱신을 검증한다.
- Cache Components 변경은 두 앱의 프로덕션 빌드에서 캐시 범위와 Suspense 누락을 확인한다. 동적 params, 빈 데이터, 캐시 키별 데이터 분리, 변경 성공/실패 후 태그 재검증도 확인한다.
- Server Action과 Route Handler의 입력 검증 및 인증/인가 실패를 테스트한다. async Server Component와 전체 라우팅 흐름은 기존 통합/E2E 방식으로 검증하고, 클라이언트 UI 및 순수 함수는 단위/Storybook 테스트로 검증한다.
- 루트 `pnpm test`는 `scripts/*.test.mjs`를 실행하며 앱 전체 E2E를 대신하지 않는다. `test-storybook`, `test:e2e` 등은 해당 `package.json`에 정의된 스크립트를 확인한 뒤 실행한다.
- 테스트 통과를 목적으로 기존 테스트를 삭제하거나 검증 수준을 낮추지 않는다.
- 테스트 환경이 없는 프로젝트에 승인 없이 새로운 테스트 프레임워크를 설치하지 않는다.
- 검증 명령을 실행하지 못한 경우 실행한 것처럼 보고하지 않는다.

기준: [Next.js 16 변경 사항](https://nextjs.org/docs/app/guides/upgrading/version-16).
