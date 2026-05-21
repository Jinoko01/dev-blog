import { ArticlesClient } from "@/components/articles-client";
import { getArticles, getTags } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "Articles",
  description: "Browse all articles, tutorials, and insights.",
};

export default async function ArticlesPage() {
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
