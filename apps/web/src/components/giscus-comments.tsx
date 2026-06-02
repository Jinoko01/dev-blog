"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { PostLikeButton } from "@/components/post-metrics";

export function GiscusComments({
  slug,
  initialLikes,
}: {
  slug: string;
  initialLikes: number;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-20 pt-12 border-t border-black/5 dark:border-white/10 stagger-delay-3 rounded">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-2xl font-bold font-display">Comments</h3>
        <PostLikeButton slug={slug} initialLikes={initialLikes} />
      </div>
      <Giscus
        id="Comment"
        repo="Jinoko01/dev-blog"
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category="General"
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
