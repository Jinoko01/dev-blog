"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveGrid } from "./interactive-grid";
import { useInViewOnce } from "./reveal-wrap";

const WORD = ["O", "K", "O", "J", "I", "N"];

export function LandingHero() {
  const [letterIn, setLetterIn] = useState(false);
  const [heroRef, heroInView] = useInViewOnce<HTMLElement>({
    rootMargin: "0px",
    threshold: 0.35,
  });

  useEffect(() => {
    if (!heroInView) {
      return;
    }

    const id = setTimeout(() => setLetterIn(true), 0);
    return () => clearTimeout(id);
  }, [heroInView]);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={heroRef}
      className={`hero-wrap flex-1 flex flex-col${heroInView ? " is-visible" : ""}`}
    >
      <div className="hero-grid" aria-hidden="true">
        <InteractiveGrid />
      </div>

      <div className="relative pointer-events-none flex-1 max-w-7xl w-full mx-auto px-6 flex flex-col items-center text-center gap-8 justify-center [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
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
            onClick={handleAboutClick}
          >
            About me <ArrowRight size={14} />
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
