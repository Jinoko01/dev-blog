"use client";

import { ArrowRight, Github } from "lucide-react";
import { useEffect, useState } from "react";

const WORD = ["O", "K", "O", "J", "I", "N"];

export function LandingHero() {
  const [letterIn, setLetterIn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLetterIn(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="hero-wrap flex-1 flex flex-col">
      <div className="hero-grid" aria-hidden="true" />

      <div className="relative flex-1 max-w-7xl w-full mx-auto px-6 flex flex-col items-center text-center gap-8 justify-center">
        <div className="hero-status inline-flex items-center gap-2.5 px-3.5 py-2 border border-border rounded-full bg-card/70 backdrop-blur-sm">
          <span className="status-dot" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
            Available
          </span>
        </div>

        <h1 className="hero-display text-center">
          <span className="block text-[0.18em] font-bold tracking-[0.2em] text-muted-foreground mb-[0.3em]">
            Hello, I&apos;m
          </span>
          <span className="block">
            {WORD.map((ch, i) => (
              <span
                key={i}
                className={`letter${letterIn ? " is-in" : ""}${i === 3 ? " letter--accent" : ""}`}
                style={{ transitionDelay: `${i * 80 + 100}ms` }}
              >
                {ch}
              </span>
            ))}
            <span
              className={`letter text-primary${letterIn ? " is-in" : ""}`}
              style={{ transitionDelay: `${WORD.length * 80 + 180}ms` }}
            >
              .
            </span>
          </span>
        </h1>

        <p className="hero-subtitle m-0 max-w-180 text-[clamp(16px,1.6vw,20px)] leading-[1.6] text-foreground">
          <span className="text-muted-foreground">
            디테일에 집착하고, 시스템처럼 설계된 인터페이스를 좋아합니다.
            아키텍처부터 마이크로 인터랙션까지, 모든 단위에서 사용자의 경험을
            짓습니다.
          </span>
        </p>

        <div className="hero-cta flex gap-3 flex-wrap justify-center mt-2">
          <a
            href="#about"
            className="hero-btn-primary inline-flex items-center gap-2.5 px-5.5 py-3.5 bg-primary text-white text-[12px] font-bold tracking-[0.2em] uppercase rounded-full transition-[transform,background] duration-200"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            About me <ArrowRight size={14} />
          </a>
          <a
            href="https://github.com/Jinoko01"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn-ghost inline-flex items-center gap-2.5 px-5.5 py-3.5 border border-border text-[12px] font-bold tracking-[0.2em] uppercase rounded-full text-foreground transition-all duration-200"
          >
            <Github size={14} /> GitHub
          </a>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        Scroll
        <span className="bar" />
      </div>
    </section>
  );
}
