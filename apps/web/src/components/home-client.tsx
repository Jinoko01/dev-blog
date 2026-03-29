"use client";

import { useEffect, useMemo, useState } from "react";
import type { PostMetadata } from "@/lib/mdx";
import { PostList } from "@/components/post-list";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Eye, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [dailyVisits, setDailyVisits] = useState<number | null>(null);

  const sortedPosts = useMemo(() => {
    const copy = [...posts];
    copy.sort((a: any, b: any) => {
      if (sortType === "popular") {
        const scoreA = (a.views || 0) + (a.likes || 0) * 2;
        const scoreB = (b.views || 0) + (b.likes || 0) * 2;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return copy;
  }, [posts, sortType]);

  const popularPosts = useMemo(() => {
    const copy = [...posts];
    copy.sort((a: any, b: any) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 2;
      const scoreB = (b.views || 0) + (b.likes || 0) * 2;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return copy.slice(0, 5);
  }, [posts]);

  useEffect(() => {
    const trackVisitor = async () => {
      let sessionId = localStorage.getItem("devblog_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("devblog_session_id", sessionId);
      }

      const { data, error } = await supabase.rpc("track_page_view", {
        p_session_id: sessionId,
      });

      if (!error && data !== null) {
        setDailyVisits(data);
      }
    };

    trackVisitor();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 mt-8"
      >
        <h1 className="text-5xl md:text-7xl lg:text-[100px] leading-[0.9] font-black tracking-tighter text-center text-[color:var(--color-foreground)] mb-12 uppercase">
          FRONTEND<br/>ARCHITECTURE
        </h1>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase border-y border-[color:var(--color-border)] py-4">
          <div className="flex items-center gap-2">
            <span>DAILY VISITS</span>
            <span className="text-[color:var(--color-foreground)]">
              {dailyVisits !== null ? dailyVisits : "-"}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[color:var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span>TOTAL POSTS</span>
            <span className="text-[color:var(--color-foreground)]">{posts.length || 8}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[color:var(--color-border)]" />
          <div className="flex items-center gap-2">
            <span>SYSTEM STATUS</span>
            <span className="text-[color:var(--color-primary)]">OPTIMIZED</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
            className="flex items-center justify-between border-b border-[color:var(--color-border)]/50 pb-2"
          >
            <h2 className="text-sm font-bold tracking-widest text-[color:var(--color-primary)] uppercase">
              LATEST ARTICLES
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSortType("latest")}
                className={`pb-2 -mb-[9px] px-1 text-xs font-bold tracking-widest transition-colors border-b-2 cursor-pointer ${
                  sortType === "latest"
                    ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                    : "border-transparent text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                }`}
              >
                LATEST
              </button>
              <button
                onClick={() => setSortType("popular")}
                className={`pb-2 -mb-[9px] px-1 text-xs font-bold tracking-widest transition-colors border-b-2 cursor-pointer ${
                  sortType === "popular"
                    ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                    : "border-transparent text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                }`}
              >
                POPULAR
              </button>
            </div>
          </motion.div>

          <PostList allPosts={sortedPosts} variant="figma" />
        </div>

        <div className="space-y-12 lg:pl-4">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
          >
            <h3 className="text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase border-b border-[color:var(--color-border)]/50 pb-2 mb-4">
              TOPICS
            </h3>
            <div className="flex flex-wrap gap-2">
              {['REACT', 'TYPESCRIPT', 'NEXT.JS', 'CSS ARCHITECTURE', 'ALGORITHMS', 'WEB'].map((topic) => (
                <span 
                  key={topic} 
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[color:var(--color-secondary)]/80 text-[color:var(--color-secondary-foreground)] rounded-sm border border-[color:var(--color-border)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.26, duration: 0.45, ease: "easeOut" }}
          >
            <h3 className="text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase border-b border-[color:var(--color-border)]/50 pb-2 mb-4">
              TRENDING
            </h3>
            <div className="space-y-3">
              {popularPosts.length > 0 ? popularPosts.map((post, index) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="block group">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[color:var(--color-secondary)]/40 transition-colors">
                    <span className="shrink-0 text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] w-5">
                      0{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[color:var(--color-foreground)] group-hover:text-[color:var(--color-primary)] transition-colors line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />{(post as any).views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />{(post as any).likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-muted-foreground)]">
                  No Trending Posts
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.34, duration: 0.45, ease: "easeOut" }}
            className="w-full h-64 bg-[color:var(--color-secondary)]/30 border border-[color:var(--color-border)] flex items-center justify-center rounded-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-[color:var(--color-primary)]/10 to-transparent" />
            <span className="text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase relative z-10">
              AD SPACE
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

