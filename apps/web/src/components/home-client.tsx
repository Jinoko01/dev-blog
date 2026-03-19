"use client";

import { useEffect, useMemo, useState } from "react";
import type { PostMetadata } from "@/lib/mdx";
import { PostList } from "@/components/post-list";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Eye, Heart } from "lucide-react";

type SortType = "latest" | "popular";

const visitorStats = [
  { date: "2026-03-13", visitors: 54 },
  { date: "2026-03-14", visitors: 62 },
  { date: "2026-03-15", visitors: 49 },
  { date: "2026-03-16", visitors: 71 },
  { date: "2026-03-17", visitors: 83 },
  { date: "2026-03-18", visitors: 76 },
  { date: "2026-03-19", visitors: 92 },
];

function Sparkline({ values }: { values: number[] }) {
  const width = 240;
  const height = 72;
  const pad = 6;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const pts = values.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / Math.max(1, values.length - 1);
    const y = pad + (height - pad * 2) * (1 - (v - min) / range);
    return { x, y };
  });

  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const area = `${d} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-[72px]"
      role="img"
      aria-label="방문자 추이"
    >
      <path
        d={area}
        fill="url(#sparkFill)"
        opacity={0.9}
      />
      <path
        d={d}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HomeClient({ posts }: { posts: PostMetadata[] }) {
  const [sortType, setSortType] = useState<SortType>("latest");

  const sortedPosts = useMemo(() => {
    const copy = [...posts];
    copy.sort((a, b) => {
      if (sortType === "popular") {
        // TODO: replace with real metrics from Supabase when list metrics are wired
        return a.title.localeCompare(b.title);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return copy;
  }, [posts, sortType]);

  const popularPosts = useMemo(() => {
    const copy = [...posts];
    copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy.slice(0, 5);
  }, [posts]);

  const today = visitorStats[visitorStats.length - 1]?.visitors ?? 0;

  useEffect(() => {
    // reserve for future: hydrate metrics
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <h2 className="text-2xl font-semibold text-[color:var(--color-foreground)]">
              전체 글
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortType("latest")}
                className={`px-4 py-2 rounded-lg transition-colors border ${
                  sortType === "latest"
                    ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] border-transparent"
                    : "bg-[color:var(--color-secondary)]/60 text-[color:var(--color-secondary-foreground)] hover:bg-[color:var(--color-secondary)] border-[color:var(--color-border)]"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                최신순
              </button>
              <button
                onClick={() => setSortType("popular")}
                className={`px-4 py-2 rounded-lg transition-colors border ${
                  sortType === "popular"
                    ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] border-transparent"
                    : "bg-[color:var(--color-secondary)]/60 text-[color:var(--color-secondary-foreground)] hover:bg-[color:var(--color-secondary)] border-[color:var(--color-border)]"
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                인기순
              </button>
            </div>
          </motion.div>

          <PostList allPosts={sortedPosts} variant="figma" />
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
            className="bg-[color:var(--color-card)] rounded-xl p-5 shadow-sm border border-[color:var(--color-border)]"
          >
            <h3 className="font-semibold text-[color:var(--color-card-foreground)] mb-4">
              방문자 통계
            </h3>
            <Sparkline values={visitorStats.map((d) => d.visitors)} />
            <div className="mt-4 text-center">
              <p className="text-2xl font-semibold text-[color:var(--color-primary)]">
                {today}
              </p>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                오늘 방문자
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.26, duration: 0.45, ease: "easeOut" }}
            className="bg-[color:var(--color-card)] rounded-xl p-5 shadow-sm border border-[color:var(--color-border)]"
          >
            <h3 className="font-semibold text-[color:var(--color-card-foreground)] mb-4">
              인기 글
            </h3>
            <div className="space-y-3">
              {popularPosts.map((post, index) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="block group">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[color:var(--color-secondary)]/40 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[color:var(--color-card-foreground)] group-hover:text-[color:var(--color-primary)] transition-colors line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />0
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />0
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.34, duration: 0.45, ease: "easeOut" }}
          >
            <Link
              href="/algorithm"
              className="block bg-gradient-to-br from-[color:var(--color-primary)]/20 to-[color:var(--color-accent)]/20 rounded-xl p-6 shadow-sm border border-[color:var(--color-primary)]/30 hover:shadow-lg transition-shadow group"
            >
              <h3 className="font-semibold text-[color:var(--color-card-foreground)] mb-2 group-hover:text-[color:var(--color-primary)] transition-colors">
                알고리즘 아카이브
              </h3>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                문제 풀이와 코드 구현을 확인해보세요
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

