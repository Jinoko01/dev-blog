# About Stats API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AboutSection의 하드코딩된 포스트 수(42)·알고리즘 수(128)를 백엔드 `GET /api/stats`에서 받아온 실제 값으로 교체한다.

**Architecture:** 백엔드에 `GET /api/stats` 엔드포인트를 추가해 DB COUNT 쿼리로 postCount·algorithmCount를 반환한다. 프론트엔드 `page.tsx`(서버 컴포넌트)가 `getPosts()`와 병렬로 `getStats()`를 호출하고, 결과를 `HomeClient` → `AboutSection`으로 props로 전달한다.

**Tech Stack:** Spring Boot 3.x (Java 21, Gradle), Spring Data JPA, JUnit 5 + MockMvc | Next.js App Router, TypeScript

---

## 파일 맵

### 백엔드 (`C:\project\dev-blog-backend`)
| 역할 | 경로 |
|------|------|
| 새로 생성: DTO | `src/main/java/com/okojin/dev/blog/domain/stats/dto/StatsDto.java` |
| 새로 생성: Service | `src/main/java/com/okojin/dev/blog/domain/stats/service/StatsService.java` |
| 새로 생성: Controller | `src/main/java/com/okojin/dev/blog/domain/stats/controller/StatsController.java` |
| 새로 생성: Test | `src/test/java/com/okojin/dev/blog/domain/stats/controller/StatsControllerTest.java` |
| 수정: PostRepository | `src/main/java/com/okojin/dev/blog/domain/post/repository/PostRepository.java` |
| 수정: AlgorithmRepository | `src/main/java/com/okojin/dev/blog/domain/algorithm/repository/AlgorithmRepository.java` |
| 수정: SecurityConfig | `src/main/java/com/okojin/dev/blog/config/SecurityConfig.java` |

### 프론트엔드 (`C:\project\dev-blog\apps\web`)
| 역할 | 경로 |
|------|------|
| 수정: API 함수 | `src/lib/api.ts` |
| 수정: 홈 서버 컴포넌트 | `src/app/page.tsx` |
| 수정: HomeClient | `src/components/home-client.tsx` |
| 수정: AboutSection | `src/components/landing/about-section.tsx` |

---

## Task 1: Repository에 countByPublishedTrue() 추가

**Files:**
- Modify: `src/main/java/com/okojin/dev/blog/domain/post/repository/PostRepository.java`
- Modify: `src/main/java/com/okojin/dev/blog/domain/algorithm/repository/AlgorithmRepository.java`

- [ ] **Step 1: PostRepository에 count 메서드 추가**

`PostRepository.java`의 기존 인터페이스에 아래 줄을 추가한다:
```java
long countByPublishedTrue();
```

최종 파일:
```java
package com.okojin.dev.blog.domain.post.repository;

import com.okojin.dev.blog.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    List<Post> findByPublishedTrueOrderByCreatedAtDesc();

    Optional<Post> findBySlug(String slug);

    boolean existsBySlugAndPublishedTrue(String slug);

    long countByPublishedTrue();

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.postTags pt LEFT JOIN FETCH pt.tag WHERE p.slug = :slug")
    Optional<Post> findBySlugWithTags(String slug);

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.postTags pt LEFT JOIN FETCH pt.tag WHERE p.id = :id")
    Optional<Post> findByIdWithTags(UUID id);

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.postTags pt LEFT JOIN FETCH pt.tag WHERE p.published = true ORDER BY p.createdAt DESC")
    List<Post> findAllPublishedWithTags();
}
```

- [ ] **Step 2: AlgorithmRepository에 count 메서드 추가**

`AlgorithmRepository.java`의 기존 인터페이스에 아래 줄을 추가한다:
```java
long countByPublishedTrue();
```

최종 파일:
```java
package com.okojin.dev.blog.domain.algorithm.repository;

import com.okojin.dev.blog.domain.algorithm.entity.Algorithm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlgorithmRepository extends JpaRepository<Algorithm, UUID> {

    List<Algorithm> findByPublishedTrueOrderByCreatedAtDesc();

    Optional<Algorithm> findByIdAndPublishedTrue(UUID id);

    long countByPublishedTrue();
}
```

- [ ] **Step 3: Commit**

```bash
cd C:\project\dev-blog-backend
git add src/main/java/com/okojin/dev/blog/domain/post/repository/PostRepository.java
git add src/main/java/com/okojin/dev/blog/domain/algorithm/repository/AlgorithmRepository.java
git commit -m "feat: add countByPublishedTrue to Post/Algorithm repositories"
```

---

## Task 2: StatsDto 생성

**Files:**
- Create: `src/main/java/com/okojin/dev/blog/domain/stats/dto/StatsDto.java`

- [ ] **Step 1: StatsDto 파일 생성**

```java
package com.okojin.dev.blog.domain.stats.dto;

public record StatsDto(long postCount, long algorithmCount) {}
```

- [ ] **Step 2: Commit**

```bash
cd C:\project\dev-blog-backend
git add src/main/java/com/okojin/dev/blog/domain/stats/dto/StatsDto.java
git commit -m "feat: add StatsDto record"
```

---

## Task 3: StatsService 생성

**Files:**
- Create: `src/main/java/com/okojin/dev/blog/domain/stats/service/StatsService.java`

- [ ] **Step 1: StatsService 파일 생성**

```java
package com.okojin.dev.blog.domain.stats.service;

import com.okojin.dev.blog.domain.algorithm.repository.AlgorithmRepository;
import com.okojin.dev.blog.domain.post.repository.PostRepository;
import com.okojin.dev.blog.domain.stats.dto.StatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final PostRepository postRepository;
    private final AlgorithmRepository algorithmRepository;

    public StatsDto getStats() {
        long postCount = postRepository.countByPublishedTrue();
        long algorithmCount = algorithmRepository.countByPublishedTrue();
        return new StatsDto(postCount, algorithmCount);
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:\project\dev-blog-backend
git add src/main/java/com/okojin/dev/blog/domain/stats/service/StatsService.java
git commit -m "feat: add StatsService"
```

---

## Task 4: StatsController 생성 + SecurityConfig 수정

**Files:**
- Create: `src/main/java/com/okojin/dev/blog/domain/stats/controller/StatsController.java`
- Modify: `src/main/java/com/okojin/dev/blog/config/SecurityConfig.java`

- [ ] **Step 1: StatsController 파일 생성**

```java
package com.okojin.dev.blog.domain.stats.controller;

import com.okojin.dev.blog.domain.stats.dto.StatsDto;
import com.okojin.dev.blog.domain.stats.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Stats", description = "통계 API")
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @Operation(summary = "통계 조회", description = "게시된 포스트 수와 알고리즘 수를 반환합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @SecurityRequirements
    @GetMapping
    public StatsDto getStats() {
        return statsService.getStats();
    }
}
```

- [ ] **Step 2: SecurityConfig에서 `/api/stats` 공개 허용**

`SecurityConfig.java`의 `authorizeHttpRequests` 블록에서 아래 줄을:
```java
.requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/algorithms/**", "/api/tags/**", "/api/articles/**").permitAll()
```
다음과 같이 변경한다:
```java
.requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/algorithms/**", "/api/tags/**", "/api/articles/**", "/api/stats").permitAll()
```

- [ ] **Step 3: Commit**

```bash
cd C:\project\dev-blog-backend
git add src/main/java/com/okojin/dev/blog/domain/stats/controller/StatsController.java
git add src/main/java/com/okojin/dev/blog/config/SecurityConfig.java
git commit -m "feat: add GET /api/stats endpoint"
```

---

## Task 5: StatsControllerTest 작성 및 실행

**Files:**
- Create: `src/test/java/com/okojin/dev/blog/domain/stats/controller/StatsControllerTest.java`

- [ ] **Step 1: StatsControllerTest 파일 생성**

```java
package com.okojin.dev.blog.domain.stats.controller;

import com.okojin.dev.blog.auth.JwtUtil;
import com.okojin.dev.blog.common.exception.GlobalExceptionHandler;
import com.okojin.dev.blog.config.SecurityConfig;
import com.okojin.dev.blog.domain.stats.dto.StatsDto;
import com.okojin.dev.blog.domain.stats.service.StatsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StatsController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class StatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private StatsService statsService;

    @Test
    void 통계를_조회한다() throws Exception {
        given(statsService.getStats()).willReturn(new StatsDto(12L, 35L));

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postCount").value(12))
                .andExpect(jsonPath("$.algorithmCount").value(35));

        then(statsService).should().getStats();
    }

    @Test
    void 인증_없이도_통계를_조회할_수_있다() throws Exception {
        given(statsService.getStats()).willReturn(new StatsDto(0L, 0L));

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk());
    }
}
```

- [ ] **Step 2: 테스트 실행**

```bash
cd C:\project\dev-blog-backend
./gradlew test --tests "com.okojin.dev.blog.domain.stats.controller.StatsControllerTest"
```

Expected: `BUILD SUCCESSFUL`, 2 tests passed.

- [ ] **Step 3: Commit**

```bash
git add src/test/java/com/okojin/dev/blog/domain/stats/controller/StatsControllerTest.java
git commit -m "test: add StatsControllerTest"
```

---

## Task 6: 프론트엔드 api.ts에 getStats() 추가

**Files:**
- Modify: `apps/web/src/lib/api.ts`

- [ ] **Step 1: ApiStats 타입과 getStats() 함수 추가**

`apps/web/src/lib/api.ts` 파일 맨 아래에 추가한다:

```typescript
export type ApiStats = {
  postCount: number;
  algorithmCount: number;
};

export async function getStats() {
  return apiFetch<ApiStats>("/api/stats", {
    next: { revalidate: 60 },
  });
}
```

- [ ] **Step 2: Commit**

```bash
cd C:\project\dev-blog
git add apps/web/src/lib/api.ts
git commit -m "feat: add getStats API function"
```

---

## Task 7: page.tsx에서 getStats() 호출 및 props 전달

**Files:**
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: page.tsx 수정**

기존 파일을 아래와 같이 교체한다:

```typescript
import { HomeClient } from "@/components/home-client";
import { getPosts, getStats, toPostMetadata } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  try {
    const [{ posts, total_visitors: totalVisitors }, stats] = await Promise.all([
      getPosts(),
      getStats(),
    ]);

    const uniqueTopics = new Set<string>();
    const formattedPosts = (posts ?? []).map((post) => {
      post.tags?.forEach((tag) => uniqueTopics.add(tag));
      return toPostMetadata(post);
    });

    return (
      <HomeClient
        posts={formattedPosts}
        topics={Array.from(uniqueTopics)}
        totalVisitors={totalVisitors ?? 0}
        postCount={stats.postCount}
        algorithmCount={stats.algorithmCount}
      />
    );
  } catch {
    return <HomeClient posts={[]} totalVisitors={0} postCount={0} algorithmCount={0} />;
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:\project\dev-blog
git add apps/web/src/app/page.tsx
git commit -m "feat: fetch real stats for AboutSection"
```

---

## Task 8: HomeClient와 AboutSection props 연결

**Files:**
- Modify: `apps/web/src/components/home-client.tsx`
- Modify: `apps/web/src/components/landing/about-section.tsx`

- [ ] **Step 1: home-client.tsx 수정**

```typescript
"use client";

import { AboutSection } from "@/components/landing/about-section";
import { CompetenciesSection } from "@/components/landing/competencies-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { LatestSection } from "@/components/landing/latest-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { recordVisit } from "@/lib/api";
import type { PostMetadata } from "@/lib/mdx";
import { useEffect } from "react";

export function HomeClient({
  posts,
  totalVisitors = 0,
  postCount = 0,
  algorithmCount = 0,
}: {
  posts: PostMetadata[];
  topics?: string[];
  totalVisitors?: number;
  postCount?: number;
  algorithmCount?: number;
}) {
  useEffect(() => {
    const STORAGE_KEY = "blog_session_id";
    let sessionId = localStorage.getItem(STORAGE_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, sessionId);
    }
    recordVisit(sessionId).catch(() => {});
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <LandingHero />
        <LandingMarquee />
      </div>
      <AboutSection
        totalVisitors={totalVisitors}
        postCount={postCount}
        algorithmCount={algorithmCount}
      />
      <CompetenciesSection />
      <TechStackSection />
      <LatestSection posts={posts} />
    </div>
  );
}
```

- [ ] **Step 2: about-section.tsx 수정**

`about-section.tsx`의 `AboutSection` 컴포넌트를 아래와 같이 수정한다. 하드코딩 값(`42`, `128`)을 props로 교체한다:

```typescript
export function AboutSection({
  totalVisitors = 0,
  postCount = 0,
  algorithmCount = 0,
}: {
  totalVisitors?: number;
  postCount?: number;
  algorithmCount?: number;
}) {
```

그리고 stats 부분을:
```typescript
<Stat value={42} unit="" label="Articles published" />
<Stat value={128} unit="" label="Problems solved" />
```
아래로 교체한다:
```typescript
<Stat value={postCount} unit="" label="Articles published" />
<Stat value={algorithmCount} unit="" label="Problems solved" />
```

- [ ] **Step 3: TypeScript 에러 없는지 확인**

```bash
cd C:\project\dev-blog
pnpm --filter web tsc --noEmit
```

Expected: 에러 없음 (출력 없음 또는 `Found 0 errors`)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/home-client.tsx
git add apps/web/src/components/landing/about-section.tsx
git commit -m "feat: wire real postCount and algorithmCount into AboutSection"
```

---

## 완료 확인

- [ ] 백엔드 `./gradlew test` 전체 통과
- [ ] 프론트엔드 `pnpm --filter web tsc --noEmit` 에러 없음
- [ ] 홈 페이지에서 AboutSection의 "Articles published"와 "Problems solved" 수치가 DB 실제 값으로 표시됨
