import { getAllPosts } from "@/lib/mdx";
import { AlgorithmListClient } from "@/components/algorithm/algorithm-list-client";

export default function AlgorithmListPage() {
  const posts = getAllPosts();
  const algo = posts.filter((p) =>
    (p.tags ?? []).some((t) => /algo|algorithm|알고리즘/i.test(t)),
  );

  return <AlgorithmListClient posts={algo} />;
}

