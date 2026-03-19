import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { codeToHtml } from "shiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { supabase } from "@/lib/supabase";
import { AlgorithmCodePanel } from "@/components/algorithm/algorithm-code-panel";
import { AlgorithmDescriptionModal } from "@/components/algorithm/algorithm-description-modal";

type Difficulty = "Easy" | "Medium" | "Hard";

function normalizeDifficulty(input?: string): Difficulty {
  const v = (input ?? "").toLowerCase();
  if (v === "easy") return "Easy";
  if (v === "hard") return "Hard";
  return "Medium";
}

function getDifficultyColor(difficulty: Difficulty) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Hard":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
}

async function highlightCode(code: string, language: string) {
  if (!code) return { htmlLight: "", htmlDark: "" };
  try {
    const [htmlLight, htmlDark] = await Promise.all([
      codeToHtml(code, { lang: language || "txt", theme: "github-light" }),
      codeToHtml(code, { lang: language || "txt", theme: "github-dark" }),
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

export const dynamic = "force-dynamic";

export default async function AlgorithmDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const { data: algo, error } = await supabase
    .from("algorithms")
    .select("*")
    .eq("id", slug)
    .single();

  if (error || !algo) {
    notFound();
  }

  const { htmlLight, htmlDark } = await highlightCode(
    algo.code || "",
    algo.language || "txt",
  );

  const difficulty = normalizeDifficulty(algo.difficulty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/algorithm"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {algo.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(algo.created_at).toLocaleDateString("ko-KR")}
          </span>
          <span
            className={`px-3 py-1 rounded-md font-medium text-sm ${getDifficultyColor(difficulty)}`}
          >
            {difficulty}
          </span>
        </div>

        {(algo.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(algo.tags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <AlgorithmCodePanel
        code={algo.code || ""}
        language={algo.language || "txt"}
        htmlLight={htmlLight}
        htmlDark={htmlDark}
      />

      {/* 우측 하단 플로팅 버튼 + 드래그 가능한 설명 팝업 */}
      <AlgorithmDescriptionModal title={algo.title}>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-code:text-sm prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-3">
          <MDXRemote
            source={algo.description || "설명이 없습니다."}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: {
                        light: "github-light",
                        dark: "github-dark",
                      },
                      keepBackground: false,
                    },
                  ],
                ],
              },
            }}
          />
        </div>
      </AlgorithmDescriptionModal>
        
    </div>
  );
}
