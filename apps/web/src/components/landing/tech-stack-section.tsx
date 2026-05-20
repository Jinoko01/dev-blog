"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { RevealWrap } from "./reveal-wrap";

type StackItem = { name: string; cat: string; accent: string };

const STACK: StackItem[] = [
  { name: "React", cat: "Frontend", accent: "#61dafb" },
  { name: "TypeScript", cat: "Frontend", accent: "#3178c6" },
  { name: "Next.js", cat: "Frontend", accent: "#000000" },
  { name: "Tailwind", cat: "Frontend", accent: "#38bdf8" },
  { name: "Framer Motion", cat: "Frontend", accent: "#bb4b96" },
  { name: "Zustand", cat: "Frontend", accent: "#452a18" },
  { name: "Jotai", cat: "Frontend", accent: "#edf2f7" },
  { name: "Spring Boot", cat: "Backend", accent: "#6db33f" },
  { name: "Java 21", cat: "Backend", accent: "#ed8b00" },
  { name: "Supabase", cat: "Backend", accent: "#3ecf8e" },
  { name: "PostgreSQL", cat: "Backend", accent: "#336791" },
  { name: "Turborepo", cat: "Tool", accent: "#ff2e88" },
  { name: "Vite", cat: "Tool", accent: "#646cff" },
  { name: "Vitest", cat: "Tool", accent: "#fcc72b" },
  { name: "Figma", cat: "Tool", accent: "#f24e1e" },
];

const CATEGORIES = ["Frontend", "Backend", "Tool", "Design"];

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
                <div className="stack-tile__num">
                  {String(STACK.indexOf(t) + 1).padStart(2, "0")}
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
