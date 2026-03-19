"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-20 pt-12 border-t border-black/5 dark:border-white/10 stagger-delay-3">
      <h3 className="text-2xl font-bold font-display mb-8">Comments</h3>
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
        theme={resolvedTheme === "dark" ? "preferred_color_scheme" : "light"}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
