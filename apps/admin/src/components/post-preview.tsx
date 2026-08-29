"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image, { type ImageLoader } from "next/image";
import { X } from "lucide-react";
import type { PostFormValues } from "./post-form";

const passthroughImageLoader: ImageLoader = ({ src }) => src;
const MdxPreview = dynamic(
  () => import("./mdx-preview").then((module) => module.MdxPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-48 items-center justify-center text-sm text-[color:var(--color-muted-foreground)]">
        Loading MDX preview...
      </div>
    ),
  },
);

function parseTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <div className="flex min-h-96 items-center justify-center px-6 text-center text-sm text-[color:var(--color-muted-foreground)]">
        Write some Markdown to see the preview.
      </div>
    );
  }

  return (
    <div className="prose prose-zinc max-w-none break-words p-5 prose-headings:tracking-tight prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-img:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#0d1117] prose-pre:shadow-2xl sm:prose-lg sm:p-6">
      <MdxPreview content={content} />
    </div>
  );
}

function PostPagePreview({ values }: { values: PostFormValues }) {
  const tags = parseTags(values.tags);
  const hasThumbnail = Boolean(values.thumbnail_url.trim());

  return (
    <div className="min-h-full bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
      <header className="sticky top-0 z-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="text-xl font-black tracking-widest">OKOJIN</span>
          <div className="flex items-center gap-6 text-xs font-bold tracking-widest text-[color:var(--color-muted-foreground)]">
            <span className="text-[color:var(--color-primary)]">ARTICLES</span>
            <span className="hidden sm:inline">ALGORITHMS</span>
          </div>
        </div>
      </header>

      <main>
        <header className="relative w-full overflow-hidden border-b border-[color:var(--color-border)]">
          {hasThumbnail && (
            <>
              <Image
                loader={passthroughImageLoader}
                unoptimized
                src={values.thumbnail_url}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            </>
          )}

          <div
            className={`relative z-[1] mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center sm:px-12 sm:py-28 ${hasThumbnail ? "text-white" : ""}`}
          >
            <div
              className={`mb-6 flex flex-wrap items-center justify-center gap-3 text-sm font-medium tracking-wide ${hasThumbnail ? "text-white/80" : "text-[color:var(--color-muted-foreground)]"}`}
            >
              <span>Draft preview</span>
              {tags.length > 0 && <span aria-hidden="true">·</span>}
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      hasThumbnail
                        ? "font-semibold text-orange-300"
                        : "font-semibold text-[color:var(--color-primary)]"
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl">
              {values.title.trim() || "Untitled post"}
            </h1>
            {values.description.trim() && (
              <p
                className={`max-w-2xl text-lg leading-relaxed sm:text-xl ${hasThumbnail ? "text-white/90" : "text-[color:var(--color-muted-foreground)]"}`}
              >
                {values.description}
              </p>
            )}
          </div>
        </header>

        <article className="mx-auto w-full max-w-3xl px-6 py-10 pb-32">
          <MarkdownPreview content={values.content} />
        </article>
      </main>
    </div>
  );
}

export function FullPostPreview({
  values,
  onClose,
}: {
  values: PostFormValues;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full page preview"
      className="fixed inset-0 z-50 overflow-y-auto bg-[color:var(--color-background)]"
    >
      <div className="fixed right-5 top-5 z-20 flex items-center gap-3">
        <span className="hidden rounded-full border border-white/15 bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur sm:inline">
          Preview mode
        </span>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-xl transition hover:bg-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-2"
          aria-label="Close full page preview"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <PostPagePreview values={values} />
    </div>
  );
}
