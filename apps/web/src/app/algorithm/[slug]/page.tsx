import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { codeToHtml } from "shiki";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { supabase } from "@/lib/supabase";
import { AlgorithmCodePanel } from "@/components/algorithm/algorithm-code-panel";
import { AlgorithmDescriptionModal } from "@/components/algorithm/algorithm-description-modal";
import { Pre } from "@/components/mdx/pre";

function getDifficultyColor(difficulty: string) {
  const v = difficulty.toLowerCase();
  if (
    v.includes("플레") ||
    v.includes("d5") ||
    v.includes("lv4") ||
    v.includes("hard")
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
  if (
    v.includes("골드") ||
    v.includes("d3") ||
    v.includes("d4") ||
    v.includes("lv2") ||
    v.includes("lv3") ||
    v.includes("medium")
  ) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
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

  const difficulty = algo.difficulty || "Unrated";
  const platform = algo.platform || "Platform";

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-[color:var(--color-background-solid)]">
      <AlgorithmCodePanel
        code={algo.code || ""}
        language={algo.language || "txt"}
        htmlLight={htmlLight}
        htmlDark={htmlDark}
      />

      {/* 플로팅 버튼 + 드래그 가능한 설명 팝업 내부에 메타데이터 편입 */}
      <AlgorithmDescriptionModal title="PROBLEM INFO">
        <div className="mb-6">
          <Link
            href="/algorithm"
            className="inline-flex items-center gap-1 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] transition-colors mb-4 text-[10px] font-bold tracking-widest uppercase border border-border px-3 py-1.5 rounded-full hover:bg-secondary/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO LIST
          </Link>
          <h1 className="text-2xl font-black text-[color:var(--color-foreground)] mb-4">
            {algo.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)] uppercase">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(algo.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span
              className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-widest ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </span>
            {platform && (
              <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {platform}
              </span>
            )}
          </div>

          {(algo.tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6 pb-6 border-b border-[color:var(--color-border)]/50">
              {(algo.tags ?? []).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-secondary border border-border text-secondary-foreground"
                >
                  <Tag className="w-3 h-3 inline-block mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-code:text-sm prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10 prose-pre:shadow-xl prose-pre:my-6 prose-pre:rounded-xl">
          <MDXRemote
            source={algo.description || "No description provided."}
            components={{ pre: Pre }}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
              },
            }}
          />
        </div>
      </AlgorithmDescriptionModal>
    </div>
  );
}
