"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import type { PostMetadata } from "@/lib/mdx";
import { Eye, Heart } from "lucide-react";

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
                ? "group relative block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border"
                : "group relative p-8 block bg-white/60 dark:bg-gray-900/40 backdrop-blur-[2px] rounded-3xl border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fade-in-up"
            }
            style={{
              animationDelay: `${(index % 6) * 0.1}s`,
              animationFillMode: "both",
            }}
          >
            <Link
              href={`/posts/${post.slug}`}
              aria-label={`Read ${post.title}`}
            >
            {variant === "figma" ? (
              <>
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {(post as any).thumbnail_url ? (
                    <Image
                      src={(post as any).thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/15 via-white/30 to-accent/20 dark:via-black/10 transition-transform group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap gap-2 relative z-20">
                    {post.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                          i === 0 
                            ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]" 
                            : "bg-secondary/60 text-secondary-foreground"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-bold text-xl text-card-foreground line-clamp-2 leading-tight">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-medium text-[color:var(--color-muted-foreground)] pt-4 mt-2 border-t border-[color:var(--color-border)]/50">
                    <span className="tracking-wide text-[color:var(--color-foreground)]">{new Date(post.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="flex gap-3 font-bold tracking-widest text-[10px] uppercase">
                      <span className="flex items-center gap-1 text-[color:var(--color-muted-foreground)]"><Eye className="w-3 h-3" /> {(post as any).views || 0}</span>
                      <span className="flex items-center gap-1 text-[color:var(--color-muted-foreground)]"><Heart className="w-3 h-3" /> {(post as any).likes || 0}</span>
                    </span>
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
            </Link>
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
                ? "w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"
                : "w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"
            }
          />
        </div>
      )}
    </>
  );
}
