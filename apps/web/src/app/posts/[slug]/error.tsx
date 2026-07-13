"use client";

import { useEffect } from "react";

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <h2 className="text-2xl font-bold text-foreground">
        게시글을 불러올 수 없습니다
      </h2>
      <p className="text-foreground/60">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
