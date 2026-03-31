"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostMetadata } from "@/lib/mdx";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Search, Tag } from "lucide-react";

const ITEMS_PER_PAGE = 10;

type Difficulty = "Easy" | "Medium" | "Hard";

function normalizeDifficulty(input?: string): Difficulty {
  const v = (input ?? "").toLowerCase();
  if (v === "easy") return "Easy";
  if (v === "hard") return "Hard";
  return "Medium";
}

function getDifficultyColor(difficulty: Difficulty) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100/60 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800";
    case "Medium":
      return "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] dark:bg-[color:var(--color-primary)]/20 dark:border-[color:var(--color-primary)]/30 border border-[color:var(--color-primary)]/20";
    case "Hard":
      return "bg-red-100/60 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800";
  }
}

export function AlgorithmListClient({
  posts,
}: {
  posts: Array<
    PostMetadata & {
      difficulty?: Difficulty;
    }
  >;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const diff = normalizeDifficulty(post.difficulty);
      return (
        post.title.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        diff.toLowerCase().includes(q)
      );
    });
  }, [posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, page]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-foreground mb-4 uppercase">
          ALGORITHM ARCHIVE
        </h1>
        <p className="text-muted-foreground font-medium">
          {posts.length} problems solved
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title, tags, difficulty..."
            className="w-full pl-12 pr-4 py-4 bg-color-card rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-[color:var(--color-primary)] text-foreground shadow-sm transition-all"
          />
        </div>
      </motion.div>

      <div className="mb-4 text-sm font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase">
        {filteredPosts.length} results found
      </div>

      <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] shadow-sm rounded-xl overflow-hidden mb-8">
        <div className="grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_auto_8rem] gap-2 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[color:var(--color-border)] bg-secondary/30 text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase">
          <div className="text-center">#</div>
          <div>TITLE</div>
          <div className="hidden sm:block">TAGS</div>
          <div className="text-right">DIFF</div>
        </div>
        <div className="divide-y divide-[color:var(--color-border)]/60">
          {paginatedPosts.map((post, index) => {
            const difficulty = normalizeDifficulty(post.difficulty);
            const globalIndex = filteredPosts.length - ((page - 1) * ITEMS_PER_PAGE + index);
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/algorithm/${post.slug}`}
                  className="grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_auto_8rem] gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center hover:bg-secondary/40 transition-colors group"
                >
                  <div className="text-center text-sm text-[color:var(--color-muted-foreground)] font-mono">
                    {globalIndex}
                  </div>
                  
                  <div className="min-w-0 pr-4">
                    <h3 className="text-base font-bold text-[color:var(--color-card-foreground)] group-hover:text-[color:var(--color-primary)] transition-colors truncate">
                      {post.title}
                    </h3>
                  </div>

                  <div className="hidden sm:flex flex-wrap items-center justify-end gap-1.5 min-w-0">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-secondary border border-border text-secondary-foreground whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm bg-secondary border border-border text-secondary-foreground">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${getDifficultyColor(
                        difficulty,
                      )}`}
                    >
                      {difficulty}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-[color:var(--color-card)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  page === p
                    ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]"
                    : "bg-[color:var(--color-card)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]"
                }`}
                aria-label={`${p} 페이지`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-[color:var(--color-card)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[color:var(--color-muted-foreground)] text-lg font-medium">
            No results found
          </p>
        </div>
      )}
    </div>
  );
}

