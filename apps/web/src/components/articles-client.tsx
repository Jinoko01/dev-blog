"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getArticles, type ArticleListItem } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

type Article = ArticleListItem;

type SortOption = "latest" | "views" | "likes";
type ArticlesClientProps = {
  initialTags: string[];
  initialArticles: Article[];
  initialTotalCount: number;
};

// [rerender-no-inline-components] Defined at module level to avoid remounting on every parent render.
// [js-hoist-regexp] Hoisted to module level to avoid recreation.
const ESCAPE_REGEXP = /[.*+?^${}()|[\]\\]/g;

function HighlightText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const safeHighlight = highlight.replace(ESCAPE_REGEXP, "\\$&");
  const regex = new RegExp(`(${safeHighlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary rounded-sm px-0.5"
            style={{ display: "inline" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i} style={{ display: "inline" }}>
            {part}
          </span>
        ),
      )}
    </span>
  );
}

export function ArticlesClient({
  initialTags,
  initialArticles,
  initialTotalCount,
}: ArticlesClientProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);
  const hasUsedInitialArticles = useRef(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const isInitialQuery =
      !debouncedQuery &&
      selectedTag === null &&
      sortOption === "latest" &&
      page === 1;

    if (!hasUsedInitialArticles.current && isInitialQuery) {
      hasUsedInitialArticles.current = true;
      return;
    }

    async function fetchArticles() {
      setLoading(true);
      try {
        const result = await getArticles({
          search: debouncedQuery || undefined,
          tag: selectedTag || undefined,
          sort: sortOption === "latest" ? "latest" : "popular",
          page,
        });
        setArticles(result.data);
        setTotalCount(result.count);
      } catch {
        setArticles([]);
        setTotalCount(0);
      }
      setLoading(false);
    }

    hasUsedInitialArticles.current = true;
    fetchArticles();
  }, [debouncedQuery, selectedTag, sortOption, page]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSortOption(sort);
    setPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Articles
        </h1>
        <p className="text-sm text-muted-foreground">{totalCount} articles</p>
      </div>

      {/* Filters */}
      <div className="mb-10 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full pl-6 pr-8 py-2 bg-transparent border-b border-border text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40"
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTagSelect(null)}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              selectedTag === null
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {initialTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                selectedTag === tag
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Count + Sort */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {articles.length > 0
              ? `${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, totalCount)}`
              : "0"}{" "}
            of {totalCount}
          </span>
          <div className="flex gap-4">
            {(["latest", "views", "likes"] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => handleSortSelect(option)}
                className={`text-xs capitalize cursor-pointer transition-colors ${
                  sortOption === option
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article list */}
      {loading && articles.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">No articles found.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {articles.map((article, index) => (
            <Link
              href={`/posts/${article.slug}`}
              key={article.id}
              className="group block py-6 animate-fade-in-up"
              style={{
                animationDelay: `${(index % 10) * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-base font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                  <HighlightText
                    text={article.title}
                    highlight={debouncedQuery}
                  />
                </h2>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                  {new Date(article.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>

              {article.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                  <HighlightText
                    text={article.description}
                    highlight={debouncedQuery}
                  />
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (
                totalPages > 5 &&
                Math.abs(p - page) > 2 &&
                p !== 1 &&
                p !== totalPages
              ) {
                if (p === page - 3 || p === page + 3) {
                  return (
                    <span
                      key={p}
                      className="px-1 text-muted-foreground text-xs"
                    >
                      …
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs transition-colors cursor-pointer rounded ${
                    page === p
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
