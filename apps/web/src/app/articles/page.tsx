import { ArticlesClient } from "@/components/articles-client";
import { getTags } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "Articles",
  description: "Browse all articles, tutorials, and insights.",
};

export default async function ArticlesPage() {
  const tagsData = await getTags();
  const initialTags = Array.from(new Set(tagsData.map((t) => t.name))).sort();

  return <ArticlesClient initialTags={initialTags} />;
}
