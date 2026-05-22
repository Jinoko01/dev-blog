"use client";

import { Github, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RevealWrap, useInViewOnce } from "./reveal-wrap";

function useCountUp(target: number, shouldStart: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [target, duration, shouldStart]);

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
  const [statRef, isInView] = useInViewOnce<HTMLDivElement>();
  const shown = useCountUp(value, isInView);

  return (
    <div ref={statRef}>
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
    <section id="about" className="w-full py-[clamp(64px,8vw,128px)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-[clamp(40px,5vw,64px)] pb-4 border-b border-border">
          <div className="flex flex-col gap-3">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground">
              01 — About
            </div>
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

          <div>
            <RevealWrap delay={100}>
              <p className="text-[clamp(17px,1.7vw,22px)] leading-[1.7] text-foreground mb-[1em] max-w-160">
                <span className="font-bold">안녕하세요.</span> 신입 프론트엔드
                개발자로,
                <span className="text-primary font-bold">
                  &nbsp;디자인 시스템
                </span>
                과
                <span className="text-primary font-bold">
                  &nbsp;성능 최적화
                </span>
                를 양 축으로 인터페이스를 짓고 있습니다.
              </p>
            </RevealWrap>
            <RevealWrap delay={180}>
              <p className="text-[clamp(17px,1.7vw,22px)] leading-[1.7] text-foreground mb-[1em] max-w-160">
                눈에 보이지 않는 코드의 구조와, 눈에 너무 잘 보이는 1px의 정렬을
                동시에 신경 씁니다. 잘 짜여진 시스템은 결국 사용자가 망설이지
                않게 만들고, 그게 좋은 제품의 조용한 기초라고 믿어요.
              </p>
            </RevealWrap>
            <RevealWrap delay={260}>
              <p className="text-base leading-[1.7] text-muted-foreground mb-[1em] max-w-160">
                현재는 Next.js · Spring Boot 기반의 개인 아카이브 블로그를 개발
                및 운영하며, 알고리즘 풀이와 학습, 트러블슈팅 기록을 함께 남기고
                있습니다.
              </p>
            </RevealWrap>

            <RevealWrap delay={340}>
              <div className="flex flex-wrap gap-3 mt-8">
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
          <div className="stats mt-20">
            <Stat value={42} unit="" label="Articles published" />
            <Stat value={128} unit="" label="Problems solved" />
            <Stat value={totalVisitors} unit="" label="Total visitors" />
          </div>
        </RevealWrap>
      </div>
    </section>
  );
}
