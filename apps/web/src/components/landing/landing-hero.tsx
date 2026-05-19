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
    <section className="hero-wrap">
      <div className="hero-grid" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
          minHeight: "min(720px, 88vh)",
          justifyContent: "center",
        }}
      >
        {/* Status pill */}
        <div
          className="hero-status"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            border: "1px solid var(--border)",
            borderRadius: 9999,
            background: "color-mix(in oklch, var(--card) 70%, transparent)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="status-dot" aria-hidden="true" />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--foreground)",
            }}
          >
            Available for collaboration
          </span>
        </div>

        {/* Name with letter animation */}
        <h1 className="hero-display" style={{ textAlign: "center" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.18em",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--muted-foreground)",
              marginBottom: "0.3em",
            }}
          >
            Hello, I&apos;m
          </span>
          <span style={{ display: "block" }}>
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
              className={`letter${letterIn ? " is-in" : ""}`}
              style={{
                transitionDelay: `${WORD.length * 80 + 180}ms`,
                color: "var(--primary)",
              }}
            >
              .
            </span>
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="hero-subtitle"
          style={{
            margin: 0,
            maxWidth: 720,
            fontSize: "clamp(16px, 1.6vw, 20px)",
            lineHeight: 1.6,
            color: "var(--foreground)",
          }}
        >
          프론트엔드 개발자.&nbsp;
          <span style={{ color: "var(--muted-foreground)" }}>
            디테일에 집착하고, 시스템처럼 설계된 인터페이스를 좋아합니다.
            아키텍처부터 마이크로 인터랙션까지, 모든 단위에서 사용자의 경험을 짓습니다.
          </span>
        </p>

        {/* CTAs */}
        <div
          className="hero-cta"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <a
            href="#about"
            className="hero-btn-primary"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 22px",
              background: "var(--primary)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              borderRadius: 9999,
              transition: "transform 200ms var(--ease-emphasized), background 200ms",
            }}
          >
            About me <ArrowRight size={14} />
          </a>
          <a
            href="https://github.com/Jinoko01"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn-ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 22px",
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              borderRadius: 9999,
              color: "var(--foreground)",
              transition: "all 200ms",
            }}
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
