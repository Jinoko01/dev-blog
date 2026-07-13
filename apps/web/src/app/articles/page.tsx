import { Suspense } from "react";
import { ArticlesClient } from "@/components/articles-client";
import { getArticles, getTags } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "Articles",
  description: "Browse all articles, tutorials, and insights.",
};

async function ArticlesContent() {
  const [tagsData, articlesData] = await Promise.all([
    getTags(),
    getArticles({ sort: "latest", page: 1 }),
  ]);
  const initialTags = Array.from(new Set(tagsData.map((t) => t.name))).sort();
  const initialArticles = articlesData.data;

  return (
    <ArticlesClient
      initialTags={initialTags}
      initialArticles={initialArticles}
      initialTotalCount={articlesData.count}
    />
  );
}

function ArticlesSkeleton() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-none">
          ARTICLES
        </h2>
        <div className="h-4 w-40 mx-auto bg-secondary animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 border-t border-border pt-12 animate-pulse">
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-72 shrink-0 space-y-10">
          <div className="h-11 bg-secondary" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 bg-secondary" />
            ))}
          </div>
        </div>

        {/* List skeleton */}
        <div className="flex-1 space-y-8 w-full">
          <div className="h-9 bg-secondary" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-4 md:gap-6 w-full border-b border-border/50 pb-6"
            >
              <div className="w-full md:w-60 lg:w-[180px] aspect-video bg-secondary shrink-0" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 w-40 bg-secondary" />
                <div className="h-6 w-3/4 bg-secondary" />
                <div className="h-4 w-full bg-secondary" />
                <div className="h-4 w-2/3 bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticlesSkeleton />}>
      <ArticlesContent />
    </Suspense>
  );
}
