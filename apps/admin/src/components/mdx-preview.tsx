"use client";

import { useEffect, useState } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { mdxComponents } from "@dev-blog/mdx-renderer";
import { mdxRemoteOptions } from "@dev-blog/mdx-renderer/config";

type SerializedMdx = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;

const compiledMdxCache = new Map<string, Promise<SerializedMdx>>();
const MAX_CACHE_SIZE = 10;

function compileMdx(content: string) {
  const cached = compiledMdxCache.get(content);
  if (cached) {
    return cached;
  }

  if (compiledMdxCache.size >= MAX_CACHE_SIZE) {
    const oldestEntry = compiledMdxCache.keys().next().value;
    if (oldestEntry !== undefined) {
      compiledMdxCache.delete(oldestEntry);
    }
  }

  const compilation = serialize(content, mdxRemoteOptions);
  compiledMdxCache.set(content, compilation);
  return compilation;
}

export function MdxPreview({ content }: { content: string }) {
  const [compilation, setCompilation] = useState<{
    content: string;
    result: SerializedMdx;
  } | null>(null);
  const [error, setError] = useState<{
    content: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    compileMdx(content)
      .then((result) => {
        if (!cancelled) {
          setCompilation({ content, result });
          setError(null);
        }
      })
      .catch((compilationError: unknown) => {
        if (!cancelled) {
          compiledMdxCache.delete(content);
          setCompilation(null);
          setError({
            content,
            message:
              compilationError instanceof Error
                ? compilationError.message
                : "Unable to compile this MDX.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (error?.content === content) {
    return (
      <div role="alert" className="rounded-lg border border-red-500/40 p-4">
        <p className="text-sm font-bold text-red-600">MDX compilation failed</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-[color:var(--color-muted-foreground)]">
          {error.message}
        </pre>
      </div>
    );
  }

  if (compilation?.content !== content) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-[color:var(--color-muted-foreground)]">
        Compiling MDX...
      </div>
    );
  }

  return <MDXRemote {...compilation.result} components={mdxComponents} />;
}
