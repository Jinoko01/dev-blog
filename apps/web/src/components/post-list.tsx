"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import type { PostMetadata } from "@/lib/mdx";

export function PostList({
  allPosts,
  variant = "default",
}: {
  allPosts: PostMetadata[];
  variant?: "default" | "figma";
}) {
  const [visibleCount, setVisibleCount] = useState(6);
  const { ref } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView && visibleCount < allPosts.length) {
        setVisibleCount((prev) =>
          Math.min(prev + (variant === "figma" ? 3 : 6), allPosts.length),
        );
      }
    },
  });

  const visiblePosts = allPosts.slice(0, visibleCount);

  return (
    <>
      <div
        className={
          variant === "figma"
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        }
      >
        {visiblePosts.map((post, index) => (
          <article
            key={post.slug}
            className={
              variant === "figma"
                ? "group relative block bg-[color:var(--color-card)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-[color:var(--color-border)]"
                : "group relative p-8 block bg-white/60 dark:bg-gray-900/40 backdrop-blur-[2px] rounded-3xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in-up"
            }
            style={{
              animationDelay: `${(index % 6) * 0.1}s`,
              animationFillMode: "both",
            }}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="absolute inset-0"
              aria-label={`Read ${post.title}`}
            />
            {variant === "figma" ? (
              <>
                <div className="aspect-video overflow-hidden bg-[color:var(--color-muted)]">
                  <div className="w-full h-full bg-gradient-to-br from-[color:var(--color-primary)]/15 via-white/30 to-[color:var(--color-accent)]/20 dark:via-black/10" />
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="font-semibold text-lg text-[color:var(--color-card-foreground)] line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 relative z-20">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-[color:var(--color-secondary)]/60 text-[color:var(--color-secondary-foreground)] border border-[color:var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-[color:var(--color-muted-foreground)]">
                    <span>{new Date(post.date).toLocaleDateString("ko-KR")}</span>
                    <span className="text-xs opacity-80">조회/좋아요 준비중</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-4">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </div>
                <h4 className="text-2xl font-bold font-display mb-4 group-hover:text-brand-500 transition-colors leading-snug">
                  {post.title}
                </h4>
                <p className="text-foreground/70 line-clamp-3 leading-relaxed mb-8">
                  {post.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 relative z-20">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80 border border-black/5 dark:border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      {/* Intersection Observer Target */}
      {visibleCount < allPosts.length && (
        <div
          ref={ref}
          className="h-32 flex items-center justify-center mt-8 w-full col-span-full"
        >
          <div
            className={
              variant === "figma"
                ? "w-8 h-8 rounded-full border-4 border-[color:var(--color-primary)] border-t-transparent animate-spin"
                : "w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"
            }
          />
        </div>
      )}
    </>
  );
}
