import type { PostMetadata } from "@/lib/mdx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RevealWrap } from "./reveal-wrap";

export function LatestSection({ posts }: { posts: PostMetadata[] }) {
  const latest = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  if (latest.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-[clamp(64px,8vw,128px)] bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-[clamp(40px,5vw,64px)] pb-4 border-b border-border">
          <div className="flex flex-col gap-3">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground">
              04 — Writing
            </div>
            <h2 className="section__title">
              최근의&nbsp;<span className="underline">기록</span>
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-foreground border-b border-foreground pb-1 no-underline"
          >
            All articles <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="latest-list">
          {latest.map((post, i) => (
            <RevealWrap key={post.slug} delay={i * 60}>
              <Link href={`/posts/${post.slug}`} className="latest-item">
                <span className="latest-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="latest-title">{post.title}</h3>
                  <div className="latest-meta">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="size-0.75 rounded-full bg-current inline-block" />
                    <span>{post.tags.slice(0, 2).join(" · ")}</span>
                  </div>
                </div>
                <ArrowRight size={20} className="latest-arrow" />
              </Link>
            </RevealWrap>
          ))}
        </div>
      </div>
    </section>
  );
}
