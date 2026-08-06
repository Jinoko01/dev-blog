"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { RevealWrap } from "./reveal-wrap";

type StackItem = {
  name: string;
  cat: string;
  slug: string;
  accent: string;
  /** simpleicons에 없는 로고는 로컬 이미지(public 경로)로 대체한다. */
  img?: string;
};

const STACK: StackItem[] = [
  {
    name: "JavaScript",
    cat: "Frontend",
    slug: "javascript",
    accent: "#f7df1e",
  },
  {
    name: "TypeScript",
    cat: "Frontend",
    slug: "typescript",
    accent: "#3178c6",
  },
  { name: "Java", cat: "Backend", slug: "openjdk", accent: "#ed8b00" },
  { name: "React.js", cat: "Frontend", slug: "react", accent: "#61dafb" },
  { name: "Next.js", cat: "Frontend", slug: "nextdotjs", accent: "#000000" },
  { name: "Vite", cat: "Tool", slug: "vite", accent: "#646cff" },
  {
    name: "TanStack Query",
    cat: "Frontend",
    slug: "reactquery",
    accent: "#ff4154",
  },
  {
    name: "Zustand",
    cat: "Frontend",
    slug: "zustand",
    accent: "#452a18",
    img: "/tech/zustand.png",
  },
  {
    name: "Jotai",
    cat: "Frontend",
    slug: "jotai",
    accent: "#edf2f7",
    img: "/tech/jotai.png",
  },
  { name: "Framer Motion", cat: "Frontend", slug: "framer", accent: "#bb4b96" },
  { name: "Turborepo", cat: "Tool", slug: "turborepo", accent: "#ff2e88" },
  { name: "Tailwind", cat: "Frontend", slug: "tailwindcss", accent: "#38bdf8" },
  { name: "Emotion", cat: "Frontend", slug: "emotion", accent: "#d26ac2" },
  { name: "SCSS", cat: "Frontend", slug: "sass", accent: "#cc6699" },
  {
    name: "Playwright",
    cat: "Tool",
    slug: "playwright",
    accent: "#2ead33",
    img: "/tech/playwright.png",
  },
  { name: "Storybook", cat: "Tool", slug: "storybook", accent: "#ff4785" },
  { name: "Jest", cat: "Tool", slug: "jest", accent: "#c21325" },
  {
    name: "Spring Boot",
    cat: "Backend",
    slug: "springboot",
    accent: "#6db33f",
  },
  { name: "PostgreSQL", cat: "Backend", slug: "postgresql", accent: "#336791" },
  { name: "Supabase", cat: "Backend", slug: "supabase", accent: "#3ecf8e" },
  {
    name: "GitHub Actions",
    cat: "Tool",
    slug: "githubactions",
    accent: "#2088ff",
  },
  { name: "Vercel", cat: "Tool", slug: "vercel", accent: "#000000" },
];

const STACK_INDEX = new Map(STACK.map((item, i) => [item, i + 1]));

const CATEGORIES = ["Frontend", "Backend", "Tool"];

export function TechStackSection() {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? STACK : STACK.filter((s) => s.cat === filter);

  return (
    <section className="w-full py-[clamp(64px,8vw,128px)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-[clamp(40px,5vw,64px)] pb-4 border-b border-border">
          <div className="flex flex-col gap-3">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground">
              03 — Tech Stack
            </div>
            <h2 className="section__title">
              주로 쓰는 <span className="underline">Tech</span>
            </h2>
          </div>

          <div className="stack-filter">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`stack-filter-btn${filter === c ? " is-active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="stack-grid">
          {visible.map((t, i) => (
            <RevealWrap key={t.name} delay={(i % 8) * 35}>
              <div
                className="stack-tile"
                style={{ "--tile-accent": t.accent } as React.CSSProperties}
                tabIndex={0}
              >
                <div className="stack-tile__top">
                  <TechLogo
                    slug={t.slug}
                    name={t.name}
                    accent={t.accent}
                    img={t.img}
                  />
                  <div className="stack-tile__num">
                    {String(STACK_INDEX.get(t)).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="stack-tile__name">{t.name}</div>
                  <div className="stack-tile__cat mt-1.5">{t.cat}</div>
                </div>
              </div>
            </RevealWrap>
          ))}
        </div>

        <RevealWrap delay={120}>
          <p className="mt-12 mx-auto text-sm text-muted-foreground text-center max-w-160">
            <Sparkles
              size={14}
              className="align-middle mr-2 text-primary inline"
            />
            신기술을 배우는 것을 좋아합니다. 요즘은 하네스 엔지니어링에 관심이
            많습니다.
          </p>
        </RevealWrap>
      </div>
    </section>
  );
}

function TechLogo({
  slug,
  name,
  accent,
  img,
}: {
  slug: string;
  name: string;
  accent: string;
  img?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || (!slug && !img)) {
    return (
      <div className="tech-logo tech-logo--fallback" aria-hidden="true">
        <span style={{ color: accent || "var(--primary)" }}>
          {name.charAt(0)}
        </span>
      </div>
    );
  }
  const hex = (accent || "").replace("#", "").trim() || "currentColor";
  const src = img ?? `https://cdn.simpleicons.org/${slug}/${hex}`;
  return (
    <div className="tech-logo">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
