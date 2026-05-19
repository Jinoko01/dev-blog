import { Layers, Zap, Code2, Sparkles, type LucideIcon } from "lucide-react";
import { RevealWrap } from "./reveal-wrap";

const COMPETENCIES: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Layers,
    title: "Design Systems",
    body: "디자인 토큰부터 컴포넌트 라이브러리까지 — 디자이너와 함께 만들고, 코드와 Figma가 어긋나지 않도록 설계합니다.",
  },
  {
    icon: Zap,
    title: "Performance",
    body: "LCP / INP를 숫자로 다룹니다. 번들 분석, RSC 경계 설계, 이미지 / 폰트 로딩 최적화로 체감 속도를 끌어올립니다.",
  },
  {
    icon: Code2,
    title: "Type-Safe Arch.",
    body: "런타임 에러를 컴파일 타임으로 가져옵니다. discriminated union, zod, satisfies를 일상처럼 씁니다.",
  },
  {
    icon: Sparkles,
    title: "Motion & Detail",
    body: "인터랙션의 80%는 잘 짜인 트랜지션입니다. 16ms를 신경 쓰고, 사용자가 흐름을 잃지 않도록 마이크로 모션을 설계합니다.",
  },
];

export function CompetenciesSection() {
  return (
    <section className="section section--alt">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <div className="section__num">02 — Core</div>
            <h2 className="section__title">
              핵심 역량,&nbsp;<span className="underline">네 가지</span>
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: 360,
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--muted-foreground)",
            }}
          >
            한 가지 분야의 깊이도 중요하지만, 인접한 분야와 연결되는 능력이 더
            중요하다고 믿습니다.
          </p>
        </div>

        <div className="comp-grid">
          {COMPETENCIES.map((c, i) => (
            <RevealWrap key={c.title} delay={i * 80}>
              <article className="comp-card">
                <div className="comp-card__num">0{i + 1}</div>
                <div className="comp-card__icon">
                  <c.icon size={36} strokeWidth={1.75} />
                </div>
                <h3 className="comp-card__title">{c.title}</h3>
                <p className="comp-card__body">{c.body}</p>
              </article>
            </RevealWrap>
          ))}
        </div>
      </div>
    </section>
  );
}
