import { HomeClient } from "@/components/home-client";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const { data: metrics } = await supabase.from("post_metrics").select("*");
  const metricsMap = new Map((metrics || []).map((m) => [m.slug, m]));

  // Map Supabase columns to expected properties
  const formattedPosts = (posts || []).map((post) => {
    const postObj = {
      title: post.title,
      date: post.created_at,
      description: post.description || "",
      tags: post.tags || [],
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

  return <HomeClient posts={formattedPosts as any} />;
}
