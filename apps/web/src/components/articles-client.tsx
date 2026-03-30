"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Hash, Eye, Heart, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  created_at: string;
  views: number;
  likes: number;
  tags: string[];
};

type SortOption = "latest" | "views" | "likes";

export function ArticlesClient({ initialTags }: { initialTags: string[] }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      let q = supabase.from("articles_view").select("*", { count: "exact" });

      if (debouncedQuery) {
        q = q.or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`);
      }

      if (selectedTag) {
        q = q.contains("tags", [selectedTag]);
      }

      switch (sortOption) {
        case "views":
          q = q.order("views", { ascending: false }).order("created_at", { ascending: false });
          break;
        case "likes":
          q = q.order("likes", { ascending: false }).order("created_at", { ascending: false });
          break;
        case "latest":
        default:
          q = q.order("created_at", { ascending: false });
          break;
      }

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await q.range(from, to);

      if (!error && data) {
        setArticles(data);
        if (count !== null) setTotalCount(count);
      }
      setLoading(false);
    }

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

  // Highlighter component
  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeHighlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-primary/20 text-primary font-bold rounded-sm px-0.5" style={{ display: 'inline' }}>
              {part}
            </mark>
          ) : (
            <span key={i} style={{ display: 'inline' }}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-16">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
          ARTICLES
        </h2>
        <p className="text-muted-foreground font-medium tracking-widest text-sm uppercase">
          {totalCount} articles found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative border-t border-border pt-12">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0 space-y-10 lg:sticky lg:top-24 h-max">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase pl-1">
              <Search className="w-3.5 h-3.5" /> SEARCH
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full bg-card border border-border rounded-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
              />
              {query && (
                <button
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase pl-1">
              <Hash className="w-3.5 h-3.5" /> TAGS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              <button
                onClick={() => handleTagSelect(null)}
                className={`px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  selectedTag === null
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                ALL
              </button>
              {initialTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag === selectedTag ? null : tag)}
                  className={`px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition-all border truncate cursor-pointer ${
                    selectedTag === tag
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                  title={tag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 space-y-8 w-full min-h-[300px]">
          {/* List Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-border">
            <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              SHOWING {articles.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(page * ITEMS_PER_PAGE, totalCount)} OF {totalCount} ARTICLES
            </div>
            
            <div className="flex bg-secondary/50 p-1 border border-border">
              {(["latest", "views", "likes"] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortSelect(option)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    sortOption === option
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {loading && articles.length === 0 ? (
            <div className="flex justify-center items-center h-48 w-full">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-secondary/30 border border-border border-dashed w-full">
              <Search className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase text-center">No articles found matching<br/>your criteria.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full">
              {articles.map((article, index) => (
                <Link href={`/posts/${article.slug}`} key={article.id} className="group relative block animate-fade-in-up" style={{ animationDelay: `${(index % 10) * 0.05}s`, animationFillMode: "both" }}>
                  <article className="flex flex-col md:flex-row gap-4 md:gap-6 w-full border-b border-border/50 pb-6 group-last:border-0 group-last:pb-0">
                    {/* Thumbnail */}
                    <div className="w-full md:w-60 lg:w-[180px] aspect-video relative overflow-hidden bg-muted shrink-0 border border-border/50">
                      {article.thumbnail_url ? (
                          <Image
                            src={article.thumbnail_url}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/15 via-white/30 to-accent/20 transition-transform group-hover:scale-105 duration-500" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col pt-1 py-2">
                      <div className="flex justify-between items-start mb-0.5">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest">
                            {article.tags[0] || "ARTICLE"}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(article.created_at).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
                          </span>
                        </div>
                        
                        <div className="flex gap-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> {article.views}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5" /> {article.likes}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-black text-xl lg:text-2xl text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                        <HighlightText text={article.title} highlight={debouncedQuery} />
                      </h4>
                      
                      <p className="text-xs lg:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3 pr-4 lg:pr-12">
                        <HighlightText text={article.description || ""} highlight={debouncedQuery} />
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-12 border-t border-border">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  if (
                    totalPages > 5 &&
                    Math.abs(p - page) > 2 &&
                    p !== 1 &&
                    p !== totalPages
                  ) {
                    if (p === page - 3 || p === page + 3) {
                      return <span key={p} className="px-1 text-muted-foreground text-[10px] font-bold">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 border text-[10px] font-bold transition-all ${
                        page === p
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
