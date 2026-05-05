# Spring Backend 마이그레이션 계획

## 배경

현재 `apps/web`(블로그)과 `apps/admin`(관리자) 모두 Supabase JS 클라이언트로 DB에 직접 접근하고 있다.
이 방식은 비즈니스 로직이 프론트엔드에 분산되고, admin이 인증 없이 노출되는 구조적 문제가 있다.
Spring Boot REST API 서버를 도입해 데이터 접근을 단일 지점으로 통합하고 admin 인증을 추가한다.

## 현재 아키텍처

```
apps/web  ──→ Supabase DB (직접)
apps/admin ──→ Supabase DB (직접, 인증 없음)
apps/admin/api/upload ──→ Supabase Storage (서비스 롤 키)
```

**테이블:** posts, post_metrics, tags, post_tags, algorithms  
**스토리지:** blog-images 버킷 (서명 URL 방식)  
**인증:** 없음 (admin 전체 공개 상태)

## 목표 아키텍처

- 프론트엔드: `dev-blog/frontend`
  - `frontend/apps/web` ──→ Spring API
  - `frontend/apps/admin` ──→ Spring API
- 백엔드: `dev-blog/backend`
  - Spring Boot REST API 서버
  - Supabase PostgreSQL (DB)
  - Supabase Storage (이미지)
  - JWT 인증

```
apps/web  ──→ Spring API (공개 엔드포인트)
apps/admin ──→ Spring API (JWT 인증 필요)
Spring API ──→ Supabase DB (JDBC/JPA)
Spring API ──→ Supabase Storage (서명 URL 생성)
```

---

## Phase 1: Spring Boot 프로젝트 설정

**경로:** `backend`

- [ ] Spring Boot 3.x (2026년 기준 3.5.x 또는 3.6.x 안정 버전) + Java 프로젝트 생성 (Gradle)
- [ ] Java 21 (또는 Java 25 LTS) JVM 타겟 설정
- [ ] 필수 의존성: spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, postgresql driver
- [ ] 추가 의존성: spring-boot-starter-validation (DTO 검증용), jjwt (0.12.x 이상)
- [ ] Supabase PostgreSQL 연결 설정 (`application.yml`)
- [ ] turbo.json에 backend 앱 추가
- [ ] `backend/.env.example` 작성

**검증:** `GET /health` 응답 확인

---

## Phase 2: 데이터 모델 정의

- [ ] Entity 정의: `Post`, `Tag`, `PostTag`, `PostMetrics`, `Algorithm`
- [ ] JPA Repository 인터페이스 작성
- [ ] 응답용 DTO 정의 (엔티티 직접 노출 금지)

**Entity ↔ 현재 테이블 매핑**

| Entity | 테이블 | 비고 |
|---|---|---|
| Post | posts | slug, published 포함 |
| PostMetrics | post_metrics | views, likes |
| Tag | tags | |
| PostTag | post_tags | Post-Tag 조인 |
| Algorithm | algorithms | tags는 배열 컬럼 |

**검증:** 기존 DB 레코드 JPA로 조회 확인

---

## Phase 3: 공개 API 구현

`apps/web`에서 사용하는 읽기 전용 엔드포인트. 인증 불필요.

| Method | Path | 현재 Supabase 쿼리 |
|---|---|---|
| GET | /api/posts | posts + post_metrics 조회 |
| GET | /api/posts/{slug} | 단건 + 관련 게시글 |
| GET | /api/algorithms | algorithms 목록 |
| GET | /api/algorithms/{slug} | 단건 |
| GET | /api/tags | tags 목록 |
| POST | /api/posts/{slug}/view | increment_view_count RPC 대체 |
| POST | /api/posts/{slug}/like | increment_like_count RPC 대체 |

**검증:** 기존 web app의 각 페이지 데이터와 응답 일치 확인

---

## Phase 4: 인증 구현

현재 admin은 인증이 전혀 없어 누구나 접근 가능한 상태.

- [ ] `admin` 계정 정보 환경변수로 관리 (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- [ ] `POST /api/auth/login` → JWT 발급
- [ ] Spring Security 필터: `/api/admin/**` 경로는 JWT 필수
- [ ] JWT 만료 시간: 24h (refresh token은 1단계에서 제외)

**검증:** 토큰 없이 admin API 호출 시 401 반환

---

## Phase 5: 관리자 API 구현

`apps/admin`에서 사용하는 CRUD 엔드포인트. JWT 필요.

**게시글**
- [ ] `POST /api/admin/posts` — 생성 (tags 동시 upsert)
- [ ] `PUT /api/admin/posts/{id}` — 수정
- [ ] `PATCH /api/admin/posts/{id}/publish` — 발행 상태 토글
- [ ] `DELETE /api/admin/posts/{id}` — 삭제

**알고리즘**
- [ ] `POST /api/admin/algorithms`
- [ ] `PUT /api/admin/algorithms/{id}`
- [ ] `PATCH /api/admin/algorithms/{id}/publish`
- [ ] `DELETE /api/admin/algorithms/{id}`

**이미지 업로드**
- [ ] `POST /api/admin/upload` — Supabase Storage 서명 URL 생성 (현재 `/api/upload` 대체)

**검증:** admin 앱에서 게시글 생성·수정·삭제 전 과정 동작 확인

---

## Phase 6: 프론트엔드 마이그레이션

### apps/web

- [ ] `src/lib/supabase.ts` 제거
- [ ] 각 page.tsx의 supabase 쿼리 → `fetch('/api/...')` 또는 공통 API 클라이언트로 교체
- [ ] `post-metrics.tsx` 컴포넌트의 RPC 호출 → Spring API 호출로 교체
- [ ] `NEXT_PUBLIC_SUPABASE_*` 환경변수 제거

### apps/admin

- [ ] `src/lib/supabase.ts` 제거
- [ ] 로그인 페이지 추가 + JWT 저장 (httpOnly cookie 권장)
- [ ] 각 CRUD 페이지의 supabase 쿼리 → Spring API 호출로 교체
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 환경변수 제거 (`backend`로 이동)

**검증:** Supabase import가 남아있지 않은지 grep으로 확인

---

## Phase 7: 정리 및 배포

- [ ] `@supabase/supabase-js` 패키지 제거 (web, admin)
- [ ] `next.config.ts` 이미지 도메인에서 Supabase URL 제거 → Spring 서버 도메인으로 교체 (필요 시)
- [ ] E2E 테스트 (`pnpm test:e2e`) 통과 확인
- [ ] Spring API 배포 설정 (Docker 또는 Railway/Render 등)
- [ ] 환경변수 정리 문서 업데이트

---

## 제외 범위 (1차 마이그레이션)

- Supabase Realtime → 유지 또는 별도 계획
- Refresh Token 관리
- Rate Limiting
- Supabase Storage → S3/R2 이전 (스토리지는 Supabase 유지)

## 예상 소요

| Phase | 예상 |
|---|---|
| 1. 프로젝트 설정 | 0.5일 |
| 2. 데이터 모델 | 1일 |
| 3. 공개 API | 1일 |
| 4. 인증 | 0.5일 |
| 5. 관리자 API | 1.5일 |
| 6. 프론트엔드 교체 | 2일 |
| 7. 정리/배포 | 1일 |
| **합계** | **약 7.5일** |
