import { AlgorithmListClient } from "@/components/algorithm/algorithm-list-client";
import { getAlgorithms } from "@/lib/api";

export const revalidate = 60;

export default async function AlgorithmListPage() {
  const algos = await getAlgorithms();

  // Currently AlgorithmListClient expects `posts` array, so we align the interface
  const formattedAlgos = algos.map((algo) => ({
    title: algo.title,
    date: algo.createdAt,
    description: algo.description || "",
    tags: [...(algo.tags || []), algo.language],
    slug: algo.id,
    code: algo.code,
    language: algo.language,
    platform: algo.platform || undefined,
    difficulty: algo.difficulty || undefined,
  }));

  return <AlgorithmListClient posts={formattedAlgos} />;
}
