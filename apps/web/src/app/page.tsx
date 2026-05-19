import { HomeClient } from "@/components/home-client";
import { getPosts, toPostMetadata } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { posts, total_visitors: totalVisitors } = await getPosts();

  const uniqueTopics = new Set<string>();

  const formattedPosts = posts.map((post) => {
    post.tags?.forEach((tag) => uniqueTopics.add(tag));
    return toPostMetadata(post);
  });

  return (
    <HomeClient
      posts={formattedPosts}
      topics={Array.from(uniqueTopics)}
      totalVisitors={totalVisitors}
    />
  );
}
