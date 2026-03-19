import { HomeClient } from "@/components/home-client";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // Map Supabase columns to expected properties
  const formattedPosts = (posts || []).map((post) => ({
    title: post.title,
    date: post.created_at,
    description: post.description || "",
    tags: post.tags || [],
    slug: post.slug,
    thumbnail_url: post.thumbnail_url,
  }));

  return <HomeClient posts={formattedPosts} />;
}
