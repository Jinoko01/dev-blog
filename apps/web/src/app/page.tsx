import { HomeClient } from "@/components/home-client";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // [async-parallel] Fetch posts and metrics in parallel — previously sequential (2 round trips → 1)
  const [{ data: posts }, { data: metrics }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, post_tags(tags(name))")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase.from("post_metrics").select("*"),
  ]);

  const metricsMap = new Map((metrics || []).map((m) => [m.slug, m]));

  const uniqueTopics = new Set<string>();

  // Map Supabase columns to expected properties
  const formattedPosts = (posts || []).map((post) => {
    const postTags =
      post.post_tags?.map((pt: any) => pt.tags?.name).filter(Boolean) || [];
    postTags.forEach((tag: string) => uniqueTopics.add(tag));

    const postObj = {
      title: post.title,
      date: post.created_at,
      description: post.description || "",
      tags: postTags,
      slug: post.slug,
      thumbnail_url: post.thumbnail_url,
    };
    const m = metricsMap.get(post.slug);
    return {
      ...postObj,
      views: m ? m.views : 0,
      likes: m ? m.likes : 0,
    };
  });

  return (
    <HomeClient
      posts={formattedPosts as any}
      topics={Array.from(uniqueTopics)}
    />
  );
}
