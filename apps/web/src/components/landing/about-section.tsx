"use client";

import { Mail, Github } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RevealWrap } from "./reveal-wrap";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) id = setTimeout(tick, 16);
    };
    tick();
    return () => clearTimeout(id);
  }, [target, duration]);
  return value;
}

function Stat({
  value,
  unit,
  label,
}: {
  value: number;
  unit: string;
  label: string;
}) {
  const shown = useCountUp(value);
  return (
    <div>
      <div className="stat__value">
        {shown}
        <span className="stat__unit">{unit}</span>
      </div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

export function AboutSection({
  totalVisitors = 0,
}: {
  totalVisitors?: number;
}) {
  return (
    <section id="about" className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <div className="section__num">01 — About</div>
            <h2 className="section__title">
              프론트엔드 개발자,&nbsp;
              <span className="underline">OKOJIN</span>
            </h2>
          </div>
        </div>

        <div className="about-grid">
          <RevealWrap>
            <div className="about-photo-frame">
              <div className="about-photo">
                <Image
                  src="/about-profile.png"
                  alt="OKOJIN"
                  fill
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </div>
          </RevealWrap>

          <div className="about-prose">
            <RevealWrap delay={100}>
              <p>
                <span className="em">안녕하세요.</span> 5년 차 프론트엔드
                개발자로,
                <span className="accent">&nbsp;디자인 시스템</span>과
                <span className="accent">&nbsp;성능 최적화</span>를 양 축으로
                인터페이스를 짓고 있습니다.
              </p>
            </RevealWrap>
            <RevealWrap delay={180}>
              <p>
                눈에 보이지 않는 코드의 구조와, 눈에 너무 잘 보이는 1px의 정렬을
                동시에 신경 씁니다. 잘 짜여진 시스템은 결국 사용자가 망설이지
                않게 만들고, 그게 좋은 제품의 조용한 기초라고 믿어요.
              </p>
            </RevealWrap>
            <RevealWrap delay={260}>
              <p style={{ fontSize: 16, color: "var(--muted-foreground)" }}>
                현재는 Next.js · Supabase 기반의 개인 아카이브 블로그를
                운영하며, 알고리즘 풀이와 학습 기록을 함께 남기고 있습니다.
                새로운 협업, 사이드 프로젝트, 기술 인터뷰 어떤 것이든 편하게
                메일 주세요.
              </p>
            </RevealWrap>

            <RevealWrap delay={340}>
              <div className="contact-row">
                <a href="mailto:dswvgw1234@gmail.com" className="contact-pill">
                  <Mail size={14} /> dswvgw1234@gmail.com
                </a>
                <a
                  href="https://github.com/Jinoko01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-pill"
                >
                  <Github size={14} /> @Jinoko01
                </a>
              </div>
            </RevealWrap>
          </div>
        </div>

        <RevealWrap delay={120}>
          <div className="stats" style={{ marginTop: 80 }}>
            <Stat value={42} unit="" label="Articles published" />
            <Stat value={128} unit="" label="Problems solved" />
            <Stat value={totalVisitors} unit="" label="Total visitors" />
          </div>
        </RevealWrap>
      </div>
    </section>
  );
}
