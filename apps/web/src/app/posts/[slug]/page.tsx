import { Suspense } from "react";
import type { Metadata } from "next";
import { Provider as JotaiProvider } from "jotai";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PostMetricsDisplay } from "@/components/post-metrics";
import { GiscusComments } from "@/components/giscus-comments";
import { Pre } from "@/components/mdx/pre";
import { CodeTabs, CodeTab } from "@/components/mdx/code-tabs";
import { getPost, getPosts, ApiError } from "@/lib/api";
import { TableOfContents } from "@/components/toc";

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug).catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    return null;
  });

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: post.title,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: "article",
      ...(post.thumbnail_url && {
        images: [{ url: post.thumbnail_url, width: 1200, height: 630 }],
      }),
    },
  };
}

export async function generateStaticParams() {
  const { posts } = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function ProseSkeleton() {
  return (
    <div className="space-y-4 animate-pulse py-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-secondary rounded-sm ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="w-full min-w-0 min-h-screen relative z-10">
      <header className="relative w-full border-b border-black/5 dark:border-white/5">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 sm:px-12 sm:py-28 flex flex-col items-center animate-pulse">
          <div className="h-4 w-52 bg-secondary mb-6" />
          <div className="h-10 w-3/4 max-w-2xl bg-secondary mb-6" />
          <div className="h-6 w-1/2 max-w-xl bg-secondary" />
        </div>
      </header>

      <div className="w-full max-w-[1600px] mx-auto px-6 pt-10 pb-32 grid grid-cols-1 xl:grid-cols-[1fr_minmax(auto,48rem)_1fr] gap-x-8">
        <div className="hidden xl:block" />
        <article className="w-full min-w-0">
          <ProseSkeleton />
        </article>
        <aside className="hidden xl:block" />
      </div>
    </div>
  );
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPost(slug).catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  });

  if (!post) {
    notFound();
  }

  const meta = {
    title: post.title,
    date: post.created_at,
    description: post.description,
    tags: post.tags || [],
  };
  const content = post.content || "";

  return (
    <JotaiProvider>
      <div className="w-full min-w-0 min-h-screen relative z-10">
        <header className="relative w-full overflow-hidden border-b border-black/5 dark:border-white/5">
          {post.thumbnail_url && (
            <>
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            </>
          )}

          <div
            className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-20 sm:px-12 sm:py-28 flex flex-col items-center text-center ${post.thumbnail_url ? "text-white" : ""}`}
          >
            <div
              className={`flex items-center justify-center gap-3 sm:gap-4 mb-6 font-medium tracking-wide text-sm ${post.thumbnail_url ? "text-white/80" : "text-foreground/60"}`}
            >
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>•</span>
              <div className="flex flex-wrap justify-center gap-2">
                {meta.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className={
                      post.thumbnail_url
                        ? "text-brand-300 font-semibold drop-shadow-sm"
                        : "text-brand-500 font-semibold"
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold font-display leading-[1.2] mb-6 tracking-tight drop-shadow-md ${post.thumbnail_url ? "text-white" : "text-foreground"}`}
            >
              {meta.title}
            </h1>
            {meta.description && (
              <p
                className={`text-lg sm:text-xl leading-relaxed max-w-2xl drop-shadow-sm ${post.thumbnail_url ? "text-white/90" : "text-foreground/70"}`}
              >
                {meta.description}
              </p>
            )}
            <div
              className={`mt-5 ${post.thumbnail_url ? "text-white/70" : "text-foreground/50"}`}
            >
              <PostMetricsDisplay
                key={slug}
                slug={slug}
                initialViews={post.views ?? 0}
                initialLikes={post.likes ?? 0}
              />
            </div>
          </div>
        </header>

        <div className="w-full max-w-[1600px] mx-auto px-6 pt-10 pb-32 grid grid-cols-1 xl:grid-cols-[1fr_minmax(auto,48rem)_1fr] gap-x-8">
          <div className="hidden xl:block" />

          <article className="w-full min-w-0">
            {/* Prose Content — MDX 컴파일이 무거우므로 헤더보다 늦게 스트리밍되도록 분리 */}
            <div className="prose sm:prose-lg dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-img:rounded-xl prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl max-w-none">
              <Suspense fallback={<ProseSkeleton />}>
                <MDXRemote
                  source={content}
                  components={{ pre: Pre, CodeTabs, CodeTab }}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [rehypePrettyCode, { theme: "github-dark" }],
                      ],
                    },
                  }}
                />
              </Suspense>
            </div>

            {/* Giscus Comments */}
            <div className="mt-20">
              <GiscusComments
                key={slug}
                slug={slug}
                initialLikes={post.likes ?? 0}
              />
            </div>
          </article>

          {/* TOC Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 w-full max-w-[16rem]">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </JotaiProvider>
  );
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent slug={slug} />
    </Suspense>
  );
}
