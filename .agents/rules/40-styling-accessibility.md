---
paths:
  - "apps/*/src/**/*.{tsx,mdx,css}"
  - "packages/*/src/**/*.{tsx,mdx,css}"
  - "apps/*/next.config.{ts,js,mjs}"
  - "apps/*/postcss.config.{js,mjs}"
---

# Next.js UI, 스타일링 및 접근성

## Tailwind와 디자인 토큰

- 스타일링은 Tailwind CSS 유틸리티와 Tailwind 테마 변수만 사용한다.
- Tailwind CSS v4의 기존 전역 CSS와 `@theme` 구성을 따른다. 전역 CSS는 앱의 루트 레이아웃에서 로드하며, v3 방식 설정 파일을 새로 강제하지 않는다.
- 인라인 `style`, CSS Module, styled-components, Emotion을 새로 사용하지 않는다.
- UI는 블루 계열의 신뢰감을 주는 톤을 유지한다.
- 색상, 간격, 크기, 그림자 값을 임의의 hex 값이나 arbitrary value로 반복하지 않고 디자인 토큰을 사용한다.
- 필요한 디자인 값이 토큰에 없다면 기존 토큰으로 표현할 수 있는지 먼저 검토한다.
- 반복 사용되는 값은 Tailwind 테마 변수로 추가한다.
- 동일한 class 조합이 반복되더라도 단순히 코드를 줄이기 위한 컴포넌트 추출은 피하고, 의미 있는 UI 단위일 때만 추출한다.
- 클릭할 수 있는 요소에는 `cursor-pointer`를 적용한다.
- hover, focus-visible, active, disabled, loading 상태를 함께 검토한다.
- 모바일, 태블릿, 데스크톱에서 명세된 레이아웃이 유지되는지 확인한다.

## Next.js UI 기본 기능

- 앱 내부 페이지 이동에는 `next/link`를 사용한다. 이벤트 이후 이동이 필요한 경우에만 `next/navigation`의 라우터를 사용하고, 외부 링크나 다운로드는 목적에 맞는 `<a>`를 사용한다.
- 콘텐츠 이미지는 `next/image`를 우선 사용한다. `width`/`height` 또는 `fill`과 부모 크기를 지정해 레이아웃 이동을 방지하고, 반응형 이미지에는 실제 레이아웃에 맞는 `sizes`를 제공한다.
- 원격 이미지 허용 범위는 `next.config.ts`의 `images.remotePatterns`로 제한한다. 모든 이미지에 선로딩을 적용하지 않으며, Next.js 16에서 선로딩이 필요할 때는 deprecated된 `priority` 대신 `preload`를 검토한다.
- 폰트는 기존 `next/font` 구성을 재사용하고 Tailwind 테마 변수와 연결한다.
- 서드파티 스크립트는 `next/script`와 목적에 맞는 로딩 전략을 사용한다. 임의로 스크립트를 삽입하거나 전체 페이지를 Client Component로 바꾸지 않는다.
- 브라우저 전용 라이브러리를 SSR에서 제외해야 할 때만 Client Component 안에서 `next/dynamic`의 `ssr: false`를 사용한다. Server Component에서는 이 옵션을 사용하지 않는다.

## 시맨틱 마크업

- 상호작용 요소는 `div`나 `span`에 클릭 이벤트를 붙이지 않고 목적에 맞는 `button`, `a`, `input` 등을 사용한다.
- 네이티브 HTML로 표현할 수 없는 경우에만 ARIA 속성을 사용한다.
- 모든 입력 요소는 연결된 `label` 또는 동등한 접근 가능한 이름을 가진다.
- 의미 있는 이미지에는 대체 텍스트를 제공한다.
- 장식용 이미지는 보조 기술에서 제외한다.

## 키보드와 상태 전달

- 모든 기능은 키보드만으로 사용할 수 있어야 한다.
- 포커스 표시를 제거하지 않는다.
- 모달, 드롭다운, 메뉴가 열리고 닫힐 때 적절한 포커스 이동과 복원을 처리한다.
- 오류를 색상만으로 전달하지 않고 텍스트 또는 아이콘과 함께 전달한다.
- 비동기 작업 결과처럼 화면이 동적으로 변경되는 경우 필요한 위치에 `aria-live` 적용을 검토한다.

기준: [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image).
