import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";

export default function AlgorithmListPage() {
  const posts = getAllPosts();
  const algo = posts.filter((p) =>
    (p.tags ?? []).some((t) => /algo|algorithm|알고리즘/i.test(t)),
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold font-display text-[color:var(--color-foreground)]">
            알고리즘 아카이브
          </h1>
          <p className="mt-2 text-[color:var(--color-muted-foreground)]">
            태그에 <span className="font-medium">algorithm/알고리즘</span>이 포함된 글을 모아 보여줘요.
          </p>
        </div>
        <div className="text-sm text-[color:var(--color-muted-foreground)]">
          총 {algo.length}개
        </div>
      </div>

      <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-[color:var(--color-border)]">
          {algo.length === 0 ? (
            <div className="p-8 text-[color:var(--color-muted-foreground)]">
              아직 알고리즘 글이 없어요. MDX frontmatter의 `tags`에 `algorithm`을 추가해보세요.
            </div>
          ) : (
            algo.map((p) => (
              <Link
                key={p.slug}
                href={`/posts/${p.slug}`}
                className="block p-5 hover:bg-[color:var(--color-secondary)]/35 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm text-[color:var(--color-muted-foreground)]">
                      {new Date(p.date).toLocaleDateString("ko-KR")}
                    </div>
                    <div className="mt-1 font-medium text-[color:var(--color-card-foreground)] truncate">
                      {p.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.tags?.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs rounded-md bg-[color:var(--color-secondary)]/60 text-[color:var(--color-secondary-foreground)] border border-[color:var(--color-border)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-[color:var(--color-primary)] whitespace-nowrap">
                    보기 →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

