import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";
import { getPosts, getStats, toPostMetadata } from "@/lib/api";

export const revalidate = 60;

async function HomeContent() {
  try {
    const [{ posts, total_visitors: totalVisitors }, stats] = await Promise.all(
      [getPosts(), getStats()],
    );

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
    return (
      <HomeClient
        posts={[]}
        totalVisitors={0}
        postCount={0}
        algorithmCount={0}
      />
    );
  }
}

function HomeSkeleton() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-16 animate-pulse">
      <div className="flex flex-col items-center space-y-6 py-12">
        <div className="h-16 w-3/4 max-w-3xl bg-secondary" />
        <div className="h-6 w-1/2 max-w-xl bg-secondary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-secondary" />
            <div className="h-6 w-3/4 bg-secondary" />
            <div className="h-4 w-full bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
