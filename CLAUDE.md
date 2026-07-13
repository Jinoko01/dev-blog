# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Frontend Code Quality (4 Criteria)

**모든 프론트엔드 코드 작성/수정/리뷰 시 아래 4가지 기준으로 자가 점검한다.**
출처: [토스 Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/code/) — "좋은 코드란 변경하기 쉬운 코드"

기준끼리 상충할 수 있다. 그럴 때는 맹목적으로 다 적용하지 말고 상황에 맞는 우선순위를 판단하고, 판단 근거를 짧게 남긴다.

### 1. 가독성 (Readability) — 코드를 읽고 동작을 이해하기 쉬운가

- **맥락 줄이기**: 한 함수/컴포넌트 안에 조건 분기가 많아 한눈에 안 읽히면 이름 있는 단위(변수, 함수, 컴포넌트)로 쪼갠다.
- **이름 붙이기**: 매직 넘버, 복잡한 조건식(`if (a && !b || c)`)에는 의미를 드러내는 이름을 붙인다.
- **위에서 아래로 읽히게 하기**: 중첩 삼항 연산자, 실행 순서와 어긋나는 조건 배치를 피한다. 코드는 위에서 아래로 읽었을 때 이해되게 작성한다.

### 2. 예측 가능성 (Predictability) — 이름과 시그니처만 보고 동작을 예측할 수 있는가

- 같은 이름/패턴의 함수·훅은 같은 종류의 값을 반환한다 (예: 모든 API 함수의 에러 처리 방식 통일).
- 성공/실패 시 반환 타입을 일관되게 유지한다 (어떤 곳은 `null`, 어떤 곳은 `throw` 하는 식으로 섞지 않는다).
- 이름이나 시그니처에 드러나지 않는 숨은 부작용(내부에서 몰래 전역 상태 변경, API 호출 등)을 만들지 않는다.

### 3. 응집도 (Cohesion) — 함께 수정되어야 할 코드가 실제로 함께 있는가

- 함께 수정되는 파일들은 같은 디렉토리(feature 단위)에 둔다. 타입/유틸을 무조건 공용 디렉토리로 흩뿌리지 않는다.
- 매직 넘버·설정값은 관련 로직 근처에 상수로 묶어 관리한다.
- 폼(form)처럼 필드 간 연관이 강한 경우, 필드 단위보다 폼 전체 단위의 응집도를 우선 고려한다.

### 4. 결합도 (Coupling) — 코드를 수정했을 때 영향 범위가 얼마나 좁은가

- 컴포넌트/훅은 책임을 하나씩만 지도록 분리한다.
- 섣부른 공통화로 서로 무관한 곳을 하나의 추상화로 묶지 않는다 — 적절한 중복은 결합도를 낮추므로 허용한다 (Simplicity First 원칙과 균형 필요).
- Props Drilling이 깊어지면 컴포넌트 합성(composition)이나 Context로 결합도를 낮춘다.

## Tech Stack

### Frontend

- Next.js 16 (App Router), TypeScript strict, MDX
- TailwindCSS v4, shadcn/ui, Framer Motion
- Recharts (Chart), lucide-react (Icons)

### Backend

- Spring Boot 3.x (2026년 기준 3.5.x 또는 3.6.x 안정 버전) + Java 프로젝트 생성 (Gradle)
- Java 21 JVM 타겟 설정
- 필수 의존성: spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, postgresql driver, lombok
- 추가 의존성: spring-boot-starter-validation (DTO 검증용), jjwt (0.12.x 이상)
- Supabase PostgreSQL 연결 설정 (`application.yml`)
- `backend/.env.example` 작성

### Infra

- Supabase
  - Storage (Images, Backups)
  - Database (PostgreSQL)
- JWT 기반 Admin 인증

## Rules

- 기획서/리포트에 가정치 금지. 실측 데이터만, 모르면 TBD 표시
- 파일 삭제 전 반드시 확인 요청
- 커밋 메시지는 영어로, conventional commits 형식
- 스타일링은 무조건 Tailwind css 방식으로

## Testing

- pnpm test (unit), pnpm test:e2e (integration)
- 테스트 없이 PR 올리지 않기
- eslint 검사를 통과하도록 코드 포맷팅 하기
