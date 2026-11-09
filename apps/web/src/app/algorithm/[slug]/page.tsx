import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { codeToHtml } from "shiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAlgorithm } from "@/lib/api.server";
import { getDifficultyTier, type DifficultyTier } from "@/lib/difficulty";
import { AlgorithmCodePanel } from "@/components/algorithm/algorithm-code-panel";
import { AlgorithmDescriptionModal } from "@/components/algorithm/algorithm-description-modal";
import { Pre } from "@/components/mdx/pre";

type AlgorithmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AlgorithmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const algo = await getAlgorithm(slug);

  return { title: algo ? `${algo.title} 풀이` : "문제를 찾을 수 없습니다" };
}

const DIFFICULTY_COLOR: Record<DifficultyTier, string> = {
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function getDifficultyColor(difficulty: string) {
  return DIFFICULTY_COLOR[getDifficultyTier(difficulty)];
}

async function highlightCode(code: string, language: string) {
  if (!code) {
    return { htmlLight: "", htmlDark: "" };
  }
  const lang = (language || "txt").toLowerCase();

  try {
    const [htmlLight, htmlDark] = await Promise.all([
      codeToHtml(code, { lang: lang, theme: "github-light" }),
      codeToHtml(code, { lang: lang, theme: "github-dark" }),
    ]);
    return { htmlLight, htmlDark };
  } catch {
    const [htmlLight, htmlDark] = await Promise.all([
      codeToHtml(code, { lang: "txt", theme: "github-light" }),
      codeToHtml(code, { lang: "txt", theme: "github-dark" }),
    ]);
    return { htmlLight, htmlDark };
  }
}

function AlgorithmDetailSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-[color:var(--color-background-solid)] animate-pulse">
      <div className="flex-1 m-4 bg-secondary border border-border" />
    </div>
  );
}

async function HighlightedCodePanel({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const { htmlLight, htmlDark } = await highlightCode(code, language);

  return (
    <AlgorithmCodePanel
      code={code}
      language={language}
      htmlLight={htmlLight}
      htmlDark={htmlDark}
    />
  );
}

async function AlgorithmDetailContent({ params }: AlgorithmPageProps) {
  const { slug } = await params;
  const algo = await getAlgorithm(slug);

  if (!algo) {
    notFound();
  }

  const difficulty = algo.difficulty || "Unrated";
  const { platform, tags } = algo;
  const createdAt = new Date(algo.createdAt);
  const hasCreatedAt = !Number.isNaN(createdAt.getTime());

  return (
    <div className="flex h-[calc(100dvh-4rem)] w-full flex-col bg-background-solid">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-10 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {algo.title}
          </h1>
          <Link
            href="/algorithm"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            알고리즘 목록
          </Link>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
          {hasCreatedAt && (
            <time
              dateTime={createdAt.toISOString()}
              className="inline-flex items-center gap-1.5 text-muted-foreground"
            >
              <Calendar aria-hidden="true" className="size-3.5" />
              {createdAt.toLocaleDateString("ko-KR", {
                timeZone: "Asia/Seoul",
              })}
            </time>
          )}
          <span
            className={`rounded-sm px-2 py-0.5 ${getDifficultyColor(difficulty)}`}
          >
            {difficulty}
          </span>
          {platform && (
            <span className="rounded-sm bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {platform}
            </span>
          )}
          {(tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-sm border border-border bg-secondary px-2 py-0.5 text-secondary-foreground"
            >
              <Tag aria-hidden="true" className="size-3" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      <Suspense
        fallback={
          <div className="m-4 flex-1 animate-pulse border border-border bg-secondary" />
        }
      >
        <HighlightedCodePanel
          code={algo.code || ""}
          language={algo.language || "txt"}
        />
      </Suspense>

      <AlgorithmDescriptionModal>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-code:text-sm prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10 prose-pre:shadow-xl prose-pre:my-6 prose-pre:rounded-xl">
          <MDXRemote
            source={algo.description || "No description provided."}
            components={{ pre: Pre }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
              },
            }}
          />
        </div>
      </AlgorithmDescriptionModal>
    </div>
  );
}

export default function AlgorithmDetailPage({ params }: AlgorithmPageProps) {
  return (
    <Suspense fallback={<AlgorithmDetailSkeleton />}>
      <AlgorithmDetailContent params={params} />
    </Suspense>
  );
}
