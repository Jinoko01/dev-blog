import { HomeClient } from "@/components/home-client";
import { getPosts, toPostMetadata } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  try {
    const { posts, total_visitors: totalVisitors } = await getPosts();

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
      />
    );
  } catch {
    return <HomeClient posts={[]} totalVisitors={0} />;
  }
}
