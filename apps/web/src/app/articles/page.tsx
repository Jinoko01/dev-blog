import { supabase } from "@/lib/supabase";
import { ArticlesClient } from "@/components/articles-client";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "Articles",
  description: "Browse all articles, tutorials, and insights.",
};

export default async function ArticlesPage() {
  const { data: tagsData } = await supabase
    .from("tags")
    .select("name")
    .order("name");

  const initialTags = tagsData ? Array.from(new Set(tagsData.map(t => t.name))) : [];

  return <ArticlesClient initialTags={initialTags} />;
}
