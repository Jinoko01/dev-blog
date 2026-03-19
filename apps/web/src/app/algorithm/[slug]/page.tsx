import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { Pre } from "@/components/mdx/pre";
import { AlgorithmCodePanel } from "@/components/algorithm/algorithm-code-panel";
import { AlgorithmDescriptionModal } from "@/components/algorithm/algorithm-description-modal";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { codeToHtml } from "shiki";

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

function extractFirstCodeFence(mdx: string) {
  // Support Windows line endings (\r\n) and language IDs like "c++", "tsx", etc.
  const re = /```([^\r\n`]*)\r?\n([\s\S]*?)\r?\n```/m;
  const m = mdx.match(re);
  if (!m) return { language: "txt", code: "", rest: mdx };
  const language = (m[1] || "txt").trim() || "txt";
  const code = (m[2] || "").replace(/\r\n/g, "\n").replace(/\n$/, "");
  const rest = (mdx.slice(0, m.index) + mdx.slice((m.index ?? 0) + m[0].length)).trim();
  return { language, code, rest };
}

async function highlightForPanel(code: string, language: string) {
  if (!code) return { htmlLight: "", htmlDark: "" };
  const lang = language || "txt";

  const [htmlLight, htmlDark] = await Promise.all([
    codeToHtml(code, {
      lang,
      theme: "github-light",
    }),
    codeToHtml(code, {
      lang,
      theme: "github-dark",
    }),
  ]);

  return { htmlLight, htmlDark };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
    .map((s) => s.replace(/\.mdx$/, ""))
    // only build for algorithm-tagged posts when possible
    .filter(Boolean);
  return slugs.map((slug) => ({ slug }));
}

export default async function AlgorithmDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let post: ReturnType<typeof getPostBySlug>;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;
  const { language, code, rest } = extractFirstCodeFence(content);
  const { htmlLight, htmlDark } = await highlightForPanel(
    code || "/* MDX 본문에 첫 코드블록(```...```)을 넣으면 여기에 표시돼요. */",
    language,
  );

  const difficulty = normalizeDifficulty((meta as any)?.difficulty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/algorithm"
          className="inline-flex items-center gap-2 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[color:var(--color-foreground)] mb-4">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-sm text-[color:var(--color-muted-foreground)]">
            <Calendar className="w-4 h-4" />
            {new Date(meta.date).toLocaleDateString("ko-KR")}
          </span>
          <span className={`px-3 py-1 rounded-md font-medium text-sm ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(meta.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)] text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AlgorithmCodePanel
          code={code || "/* MDX 본문에 첫 코드블록(```...```)을 넣으면 여기에 표시돼요. */"}
          language={language}
          htmlLight={htmlLight}
          htmlDark={htmlDark}
        />
      </div>

      <AlgorithmDescriptionModal title="설명">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote
            source={rest || meta.description || ""}
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

