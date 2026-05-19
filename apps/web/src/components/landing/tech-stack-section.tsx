"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { RevealWrap } from "./reveal-wrap";

type StackItem = { name: string; cat: string; accent: string };

const STACK: StackItem[] = [
  { name: "React", cat: "Frontend", accent: "#61dafb" },
  { name: "TypeScript", cat: "Frontend", accent: "#3178c6" },
  { name: "Next.js", cat: "Frontend", accent: "#000000" },
  { name: "Tailwind", cat: "Frontend", accent: "#38bdf8" },
  { name: "Framer Motion", cat: "Frontend", accent: "#bb4b96" },
  { name: "shadcn/ui", cat: "Frontend", accent: "#71717a" },
  { name: "Spring Boot", cat: "Backend", accent: "#6db33f" },
  { name: "Java 21", cat: "Backend", accent: "#ed8b00" },
  { name: "Supabase", cat: "Backend", accent: "#3ecf8e" },
  { name: "PostgreSQL", cat: "Backend", accent: "#336791" },
  { name: "Gradle", cat: "Tooling", accent: "#02303a" },
  { name: "Turborepo", cat: "Tooling", accent: "#ff2e88" },
  { name: "Vite", cat: "Tooling", accent: "#646cff" },
  { name: "Vitest", cat: "Tooling", accent: "#fcc72b" },
  { name: "Figma", cat: "Design", accent: "#f24e1e" },
];

const CATEGORIES = ["Frontend", "Backend", "Tooling", "Design", "Content"];

export function TechStackSection() {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? STACK : STACK.filter((s) => s.cat === filter);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <div className="section__num">03 — Tech Stack</div>
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
                  <div className="stack-tile__cat" style={{ marginTop: 6 }}>
                    {t.cat}
                  </div>
                </div>
              </div>
            </RevealWrap>
          ))}
        </div>

        <RevealWrap delay={120}>
          <p
            style={{
              margin: "48px auto 0",
              fontSize: 14,
              color: "var(--muted-foreground)",
              textAlign: "center",
              maxWidth: 640,
            }}
          >
            <Sparkles
              size={14}
              style={{
                verticalAlign: "middle",
                marginRight: 8,
                color: "var(--primary)",
              }}
            />
            신기술을 배우는 것을 좋아합니다. 요즘은 하네스 엔지니어링에 관심이
            많습니다.
          </p>
        </RevealWrap>
      </div>
    </section>
  );
}
