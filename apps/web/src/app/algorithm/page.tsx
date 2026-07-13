import { Suspense } from "react";
import { AlgorithmListClient } from "@/components/algorithm/algorithm-list-client";
import { getAlgorithms } from "@/lib/api";

export const revalidate = 60;

async function AlgorithmListContent() {
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

function AlgorithmListSkeleton() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-12 animate-pulse">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-14 w-72 bg-secondary" />
        <div className="h-4 w-48 bg-secondary" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-secondary border border-border" />
        ))}
      </div>
    </div>
  );
}

export default function AlgorithmListPage() {
  return (
    <Suspense fallback={<AlgorithmListSkeleton />}>
      <AlgorithmListContent />
    </Suspense>
  );
}
