export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold font-display text-[color:var(--color-card-foreground)]">
          About
        </h1>
        <p className="mt-4 text-[color:var(--color-muted-foreground)] leading-relaxed">
          이 페이지는 Figma 디자인 흐름을 맞추기 위해 먼저 연결해두었어요. 다음 단계에서
          프로젝트 카드/모달(마크다운)까지 디자인 그대로 확장하면 됩니다.
        </p>
      </div>
    </div>
  );
}

