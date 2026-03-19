import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { notFound } from "next/navigation";
import { PostMetrics } from "@/components/post-metrics";
import { GiscusComments } from "@/components/giscus-comments";
import { Pre } from "@/components/mdx/pre";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch (e) {
    notFound();
  }

  const { content, meta } = post;

  return (
    <div className="min-h-screen relative z-10">

      <article className="max-w-3xl mx-auto py-12 px-6 pb-32">
        <header className="mb-16 stagger-delay-1">
          <div className="flex items-center gap-4 text-foreground/60 mb-6 font-medium tracking-wide text-sm">
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <div className="flex gap-2">
              {meta.tags?.map((tag) => (
                <span key={tag} className="text-brand-500 font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-6 tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xl text-foreground/70 leading-relaxed max-w-2xl">
            {meta.description}
          </p>
          <PostMetrics slug={slug} />
        </header>

        {/* Prose Content */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-img:rounded-xl prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl max-w-none stagger-delay-2">
          <MDXRemote
            source={content}
            components={{ pre: Pre }}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
              },
            }}
          />
        </div>

        {/* Giscus Comments */}
        <GiscusComments />
      </article>
    </div>
  );
}
