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
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-[color:var(--color-foreground)] mb-4">
          알고리즘 아카이브
        </h1>
        <p className="text-[color:var(--color-muted-foreground)]">
          다양한 알고리즘 문제 풀이와 구현 코드를 확인하세요
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted-foreground)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="제목, 태그, 난이도로 검색..."
            className="w-full pl-12 pr-4 py-3 bg-[color:var(--color-input-background)] rounded-lg border border-[color:var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/50 transition-shadow text-[color:var(--color-foreground)]"
          />
        </div>
      </motion.div>

      <div className="mb-4 text-sm text-[color:var(--color-muted-foreground)]">
        {filteredPosts.length}개의 게시글
      </div>

      <div className="space-y-4 mb-8">
        {paginatedPosts.map((post, index) => {
          const difficulty = normalizeDifficulty(post.difficulty);
          return (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/algorithm/${post.slug}`}
                className="block bg-[color:var(--color-card)] rounded-lg p-6 shadow-sm border border-[color:var(--color-border)] hover:shadow-md hover:border-[color:var(--color-primary)]/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[color:var(--color-card-foreground)] group-hover:text-[color:var(--color-primary)] transition-colors mb-2">
                      {post.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--color-muted-foreground)] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("ko-KR")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md font-medium ${getDifficultyColor(
                          difficulty,
                        )}`}
                      >
                        {difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)]"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
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
          <p className="text-[color:var(--color-muted-foreground)] text-lg">
            검색 결과가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}

