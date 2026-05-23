import { HomeClient } from "@/components/home-client";
import { getPosts, getStats, toPostMetadata } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  try {
    const [{ posts, total_visitors: totalVisitors }, stats] = await Promise.all([
      getPosts(),
      getStats(),
    ]);

    const uniqueTopics = new Set<string>();
    const formattedPosts = (posts ?? []).map((post) => {
      post.tags?.forEach((tag) => uniqueTopics.add(tag));
      return toPostMetadata(post);
    });

    return (
      <HomeClient
        posts={formattedPosts}
        topics={Array.from(uniqueTopics)}
        totalVisitors={totalVisitors ?? 0}
        postCount={stats.post_count}
        algorithmCount={stats.algorithm_count}
      />
    );
  } catch {
    return <HomeClient posts={[]} totalVisitors={0} postCount={0} algorithmCount={0} />;
  }
}
