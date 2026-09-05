import Image from "next/image";
import type { ReactNode } from "react";
import { Github, Globe, Mail, Phone } from "lucide-react";

const projects = [
  {
    name: "Kumoh-Talk",
    description:
      "교내 IT 교류 활성화를 위한 모집 커뮤니티 · RTMP-HLS 기반 세미나 스트리밍 플랫폼",
    team: "11인 팀 (PM 3, 디자이너 2, FE 3, BE 3)",
    period: "2024.08 ~ 2025.06 (10개월)",
    stack: "TypeScript, Next.js, SCSS, RTMP, HLS",
    links: [
      {
        label: "깃허브",
        href: "https://github.com/Kumoh-talk/kumoh-talk-Frontend",
      },
    ],
    achievements: [
      "공지·모집글 데이터 로딩이 페이지 전체 렌더링을 지연시키는 문제를 Suspense 기반 Streaming SSR로 분리하고, 페이지네이션으로 초기 조회 범위를 15건으로 제한",
      "RTMP로 수신한 영상을 HLS로 제공하고, 네트워크 상태에 따라 화질을 조정하는 적응형 비트레이트 스트리밍 구현",
      "Lighthouse의 성능, 접근성, 권장사항, SEO를 반복 측정하고 개선하여 90점대 유지",
      "입력마다 발생하던 닉네임 중복 검사 요청에 Debounce를 적용해 불필요한 API 호출을 줄임",
      "복잡하게 분산된 폼 유효성 검사 로직을 React Hook Form과 Zod 기반의 스키마 검증으로 통합해 유지보수성 개선",
      "페이지별로 중복되던 인증 쿠키 헤더 설정을 Route Handler로 통합해 요청 처리 로직을 단일화",
      "STOMP와 Zustand 기반 실시간 채팅·Q&A·투표 기능 구현",
    ],
  },
  {
    name: "개인블로그",
    description:
      "프론트엔드 기술, 알고리즘, 트러블 슈팅 내용을 정리하는 개인 블로그 웹사이트",
    team: "개인",
    period: "2026.04 ~ 2026.05 · 현재 운영 중",
    stack:
      "TypeScript, Next.js, Tailwind, Jotai, pnpm, Turborepo, Java, Spring Boot, Supabase",
    links: [
      { label: "프론트엔드", href: "https://github.com/Jinoko01/dev-blog" },
      { label: "백엔드", href: "https://github.com/Jinoko01/dev-blog-backend" },
      { label: "배포 링크", href: "https://okojins.com/" },
    ],
    achievements: [
      "SVG 각 셀에 등록된 이벤트로 렌더링 비용이 증가해, 상위 SVG에서 이벤트를 처리하는 위임 구조로 변경",
      "메인 스레드 부하와 백그라운드 탭 전환 시 버벅이던 숫자 애니메이션을 performance.now()와 requestAnimationFrame 기반으로 변경",
      "게시글 페이지 접근마다 데이터를 요청해 발생한 중복 요청과 ISR 구조 충돌을 해결하고 게시물 리스트 렌더링 시간을 약 3s → 300ms로 단축",
      "pnpm-workspace와 Turborepo 기반 모노레포 환경을 구축해 블로그·어드민 페이지 간 컴포넌트·디자인 시스템·타입 공유",
      "프론트엔드에서 Supabase로 직접 접근하던 구조를 Spring Boot REST API 기반으로 마이그레이션",
      "Claude Code의 Researcher·Planner와 Codex의 Reviewer 역할을 분리한 AI 개발 워크플로우 구축",
      "Storybook을 활용한 컴포넌트 문서화 및 AI 기반 테스트 케이스 생성",
      "Claude rule 기반 웹 접근성·성능·코드 컨벤션 자동 가드 구축",
    ],
  },
  {
    name: "JobForeigner",
    description:
      "외국인 근로자의 정보 격차 해소를 위한 다국어 기반 구인구직 플랫폼",
    team: "6인 팀 (FE 3명, BE 3명)",
    period: "2025.01 ~ 2025.10 (9개월)",
    stack: "TypeScript, React, SCSS, TanStack Query",
    links: [
      {
        label: "깃허브",
        href: "https://github.com/th-D138/JobForeigner-FrontEnd",
      },
    ],
    achievements: [
      "액세스 토큰 만료 시 동시 요청마다 갱신이 발생하는 문제에 Single-flight 패턴을 적용하고, Mutex로 동기화해 토큰 갱신 요청을 1회로 제한",
      "TanStack Query로 서버 상태를 캐싱하고 낙관적 업데이트를 적용해 사용자 조작에 즉각적인 피드백 제공",
      "Axios 설정 및 에러 핸들링 중복 코드를 AxiosConfig 커스텀 인스턴스로 통합해 유지보수성 향상",
      "반복적인 Suspense 구현부를 HOC로 추상화해 중복 Suspense 로직 제거",
      "회원가입 시 복잡한 절차를 Multi-Step-Form으로 설계해 사용자 경험 향상",
      "페이지별 Code splitting과 Lazy loading으로 초기 로딩 속도 개선",
    ],
  },
];

const activities = [
  {
    name: "멋쟁이사자처럼 11기 FE · 12기 회장",
    period: "2023.03 ~ 2024.12",
    details: [
      "약 30명 대상 프론트엔드 스터디·멘토링과 교내 해커톤 운영",
      "HTML · CSS · JavaScript · React 학습 커리큘럼 운영",
    ],
  },
  {
    name: "차세대 컴퓨터 네트워킹 연구실 학부 연구생",
    period: "2024.03 ~ 2025.12",
    details: [
      "보육원 직접 기부 플랫폼 ‘Chirp Aid’를 개발하고, 관련 논문을 KCI 등재지 『한국정보기술학회논문지』에 공동 저자로 게재",
      "음식물 폐기 방지 플랫폼 ‘라스트냠’을 개발하고 관련 논문을 1저자로 작성·발표하여, 2025년 한국정보기술학회 하계종합학술대회에서 은상 수상",
      "실시간 웨비나 스트리밍 시스템을 개발하고 관련 논문을 1저자로 작성·발표하여, 2025년 한국정보기술학회 추계종합학술대회에서 동상 수상",
    ],
  },
];

const contributions = [
  {
    name: "Next.js",
    date: "2026.05",
    repository: "https://github.com/vercel/next.js",
    pr: "https://github.com/vercel/next.js/pull/94119",
    description:
      "next-mdx 로더의 플러그인 로드 실패가 webpack 콜백으로 전달되지 않던 문제에 .catch() 처리와 테스트를 추가한 PR 제출",
  },
  {
    name: "Toss Frontend Fundamentals",
    date: "2026.06",
    repository: "https://github.com/toss/frontend-fundamentals",
    pr: "https://github.com/toss/frontend-fundamentals/pull/859",
    description:
      "화면 너비 1024px 이하에서 tooltip이 내비게이션 버튼을 가리던 문제를 재현하고, 위치 값을 조정한 수정안을 PR로 제출",
  },
];

const skillGroups = [
  { name: "Language", skills: ["JavaScript", "TypeScript"] },
  {
    name: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "Vite",
      "TanStack Query",
      "Zustand",
      "Jotai",
      "Framer Motion",
      "Turborepo",
    ],
  },
  { name: "Styling", skills: ["Tailwind", "Emotion", "SCSS"] },
  { name: "Testing", skills: ["Playwright", "Storybook"] },
];

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h1 className="text-xl font-bold tracking-widest text-muted-foreground mb-6 border-b border-border/50 pb-3">
        {title}
      </h1>
      {children}
    </section>
  );
}

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground marker:text-primary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ResumeLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-primary transition-colors"
    >
      {children}
    </a>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto w-full sm:px-4 lg:px-6 py-12 sm:py-20">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center text-foreground mb-16 uppercase">
        ABOUT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-12 md:gap-16">
        {/* Profile Card (Left) */}
        <div className="min-w-0 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="w-48 md:w-full aspect-square rounded-3xl bg-secondary/50 border border-border overflow-hidden shadow-sm relative">
            <Image
              src="/about-profile.png"
              alt="황용진 프로필"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, (max-width: 1024px) 280px, 320px"
              priority
            />
          </div>
          <div className="w-full">
            <h2 className="text-3xl font-black text-foreground">황용진</h2>
            <p className="text-primary font-bold tracking-widest uppercase text-xs mt-2">
              Frontend Developer
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
              사용자 경험을 구조적으로 개선하는
              <br />
              신입 프론트엔드 개발자
            </p>
            <div className="mt-8 space-y-4 font-semibold text-sm text-muted-foreground">
              <a
                href="tel:01033288164"
                className="flex items-center gap-3 hover:text-foreground transition-colors group"
              >
                <Phone
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform"
                />
                010-3328-8164
              </a>
              <a
                href="mailto:dswvgw1234@gmail.com"
                className="flex items-center gap-3 hover:text-foreground transition-colors group"
              >
                <Mail
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform"
                />
                dswvgw1234@gmail.com
              </a>
              <a
                href="https://okojins.com"
                className="flex items-center gap-3 hover:text-foreground transition-colors group"
              >
                <Globe
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform"
                />
                okojins.com
              </a>
              <a
                href="https://github.com/Jinoko01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-foreground transition-colors group"
              >
                <Github
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0 text-primary group-hover:scale-110 transition-transform"
                />
                @Jinoko01
              </a>
            </div>
          </div>
        </div>

        {/* Details Area (Right) */}
        <div className="min-w-0 space-y-12 break-words">
          <ResumeSection title="핵심 역량">
            <p className="text-lg font-bold leading-relaxed mb-4 text-card-foreground">
              React · Next.js 기반 프론트엔드 개발에 강점이 있으며, 프로젝트에서
              프론트엔드 구조를 설계하고 구현하는 경험을 쌓아왔습니다.
            </p>
            <DetailList
              items={[
                "Lighthouse로 성능을 수치화하고 병목이 발생하는 지점을 찾아 개선할 수 있습니다.",
                "Trade-off를 거쳐 CSR, SSR, SSG, ISR, Streaming 등 렌더링 전략을 상황에 맞게 선택하고 로딩 성능을 개선해 왔습니다.",
                "애니메이션 최적화를 통해 끊기지 않고 부드럽게 실행되도록 할 수 있습니다.",
                "주어진 업무를 끝까지 책임지고 마무리하며, 원활한 커뮤니케이션을 통해 팀원들로부터 신뢰를 받아 왔습니다.",
              ]}
            />
          </ResumeSection>

          <ResumeSection title="프로젝트">
            <div className="space-y-10">
              {projects.map((project) => (
                <article key={project.name} className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="text-lg font-bold text-foreground">
                      {project.name}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {project.links.map((link) => (
                        <ResumeLink key={link.href} href={link.href}>
                          {link.label}
                        </ResumeLink>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground font-medium">
                    {project.description}
                  </p>
                  <dl className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                    {[
                      ["인원", project.team],
                      ["일정", project.period],
                      ["기술 스택", project.stack],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[4rem_1fr] gap-2"
                      >
                        <dt className="font-bold text-foreground">{label}</dt>
                        <dd className="min-w-0">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <DetailList items={project.achievements} />
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="대외 활동">
            <div className="space-y-8">
              {activities.map((activity) => (
                <article key={activity.name}>
                  <h4 className="text-base font-bold text-foreground">
                    {activity.name}
                  </h4>
                  <p className="mt-2 mb-4 text-xs font-semibold text-muted-foreground">
                    {activity.period}
                  </p>
                  <DetailList items={activity.details} />
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="오픈소스">
            <div className="space-y-8">
              {contributions.map((contribution) => (
                <article key={contribution.name} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="text-base font-bold text-foreground">
                      {contribution.name}
                    </h4>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                      PR 제출
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contribution.date}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <ResumeLink href={contribution.repository}>
                      저장소
                    </ResumeLink>
                    <ResumeLink href={contribution.pr}>
                      PR #{contribution.pr.split("/").pop()}
                    </ResumeLink>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {contribution.description}
                  </p>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="스킬">
            <dl className="space-y-5">
              {skillGroups.map((group) => (
                <div key={group.name} className="space-y-2.5">
                  <dt className="text-xs font-bold text-foreground">
                    {group.name}
                  </dt>
                  <dd className="flex flex-wrap gap-2.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs font-bold tracking-wider bg-secondary/80 text-secondary-foreground rounded-md border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>

          <ResumeSection title="자격증">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
              {[
                {
                  name: "정보처리기사",
                  issuer: "한국산업인력공단",
                  date: "2025.06.13",
                },
                {
                  name: "TOEIC Speaking IM2",
                  issuer: "한국TOEIC위원회",
                  date: "2026.03.08",
                },
              ].map((credential) => (
                <article
                  key={credential.name}
                  className="rounded-2xl border border-border bg-secondary/50 p-4"
                >
                  <h4 className="text-sm font-bold text-foreground">
                    {credential.name}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {credential.issuer} · {credential.date}
                  </p>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="교육">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
              {[
                {
                  name: "삼성청년SW·AI아카데미 15기 Java 전공 과정",
                  detail: "2026.01 ~ 2026.12 · 이수 중",
                },
                {
                  name: "국립금오공과대학교 컴퓨터공학부",
                  detail: "2020.03 ~ 2026.02 · 컴퓨터공학 전공",
                },
              ].map((education) => (
                <article
                  key={education.name}
                  className="rounded-2xl border border-primary/10 bg-primary/5 p-4"
                >
                  <h4 className="text-sm font-bold leading-relaxed text-foreground">
                    {education.name}
                  </h4>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    {education.detail}
                  </p>
                </article>
              ))}
            </div>
          </ResumeSection>
        </div>
      </div>
    </div>
  );
}
