import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { PostMetadata } from "@/lib/mdx";
import { RevealWrap } from "./reveal-wrap";

export function LatestSection({ posts }: { posts: PostMetadata[] }) {
  const latest = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  if (latest.length === 0) return null;

  return (
    <section className="section section--alt">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <div className="section__num">04 — Writing</div>
            <h2 className="section__title">
              최근의&nbsp;<span className="underline">기록</span>
            </h2>
          </div>
          <Link
            href="/articles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              borderBottom: "1px solid var(--foreground)",
              paddingBottom: 4,
              textDecoration: "none",
            }}
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
                <div style={{ minWidth: 0 }}>
                  <h3 className="latest-title">{post.title}</h3>
                  <div className="latest-meta">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: 9999,
                        background: "currentColor",
                        display: "inline-block",
                      }}
                    />
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
