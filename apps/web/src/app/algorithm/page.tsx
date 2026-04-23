import { AlgorithmListClient } from "@/components/algorithm/algorithm-list-client";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AlgorithmListPage() {
  const { data: algos } = await supabase
    .from("algorithms")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // Currently AlgorithmListClient expects `posts` array, so we align the interface
  const formattedAlgos = (algos || []).map((algo) => ({
    title: algo.title,
    date: algo.created_at,
    description: algo.description || "",
    tags: [...(algo.tags || []), algo.language],
    slug: algo.id,
    code: algo.code,
    language: algo.language,
    platform: algo.platform,
    difficulty: algo.difficulty,
  }));

  return <AlgorithmListClient posts={formattedAlgos} />;
}
