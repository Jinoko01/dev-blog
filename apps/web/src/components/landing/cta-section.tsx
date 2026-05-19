import { Mail, Github } from "lucide-react";
import { RevealWrap } from "./reveal-wrap";

export function CtaSection() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section__inner">
        <RevealWrap>
          <div className="cta-block">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--primary)",
                position: "relative",
              }}
            >
              Let&apos;s build something
            </div>
            <h2>
              함께 만들고 싶은 게&nbsp;
              <span className="accent">있나요?</span>
            </h2>
            <p>
              새로운 협업, 사이드 프로젝트, 디자인 시스템 작업, 어떤 것이든 좋습니다.
              메일 한 통이면 시작할 수 있어요.
            </p>
            <div className="cta-buttons">
              <a href="mailto:dswvgw1234@gmail.com" className="cta-primary">
                <Mail size={14} /> Get in touch
              </a>
              <a
                href="https://github.com/Jinoko01"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost"
              >
                <Github size={14} /> Browse work
              </a>
            </div>
          </div>
        </RevealWrap>
      </div>
    </section>
  );
}
