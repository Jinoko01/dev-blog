"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { incrementPostView } from "@/lib/api";
import {
  likesAtomFamily,
  initLikesAtom,
  toggleLikeAtom,
} from "@/store/post-metrics";
import { Heart, Eye } from "lucide-react";

/** views 표시 + view 카운트 증가 */
function usePostViews(slug: string, initialViews: number) {
  const [views, setViews] = useState(initialViews);
  const initLikes = useSetAtom(initLikesAtom);

  useEffect(() => {
    const initMetrics = async () => {
      const today = new Date().toISOString().split("T")[0];
      const viewKey = `viewed_${slug}_${today}`;

      if (!localStorage.getItem(viewKey)) {
        const metrics = await incrementPostView(slug);
        setViews(metrics.views);
        // view 증가 응답에서 받은 최신 likes로 atom 업데이트
        initLikes({ slug, initialLikes: metrics.likes });
        localStorage.setItem(viewKey, "true");
      }
    };

    initMetrics();
  }, [slug, initLikes]);

  return views;
}

/** header description 아래에 views/likes 수치를 텍스트로 표시하는 컴포넌트 */
export function PostMetricsDisplay({
  slug,
  initialViews,
  initialLikes,
}: {
  slug: string;
  initialViews: number;
  initialLikes: number;
}) {
  const views = usePostViews(slug, initialViews);
  const initLikes = useSetAtom(initLikesAtom);
  const [{ likes }] = useAtom(likesAtomFamily(slug));

  // atom 초기화 (view를 이미 카운트한 날에도 초기값 설정)
  useEffect(() => {
    initLikes({ slug, initialLikes });
  }, [slug, initialLikes, initLikes]);

  return (
    <div className="flex items-center justify-center gap-4 text-sm mt-4">
      <span className="flex items-center gap-1.5 opacity-80">
        <Eye className="w-4 h-4" />
        <span className="font-medium">{views}</span>
        <span className="opacity-70">views</span>
      </span>
      <span className="opacity-30">·</span>
      <span className="flex items-center gap-1.5 opacity-80">
        <Heart className="w-4 h-4" />
        <span className="font-medium">{likes}</span>
        <span className="opacity-70">likes</span>
      </span>
    </div>
  );
}

/** Comments 제목 우측에 표시할 like 버튼 컴포넌트 */
export function PostLikeButton({
  slug,
  initialLikes,
}: {
  slug: string;
  initialLikes: number;
}) {
  const initLikes = useSetAtom(initLikesAtom);
  const [{ likes, isLiked, isPending }] = useAtom(likesAtomFamily(slug));
  const toggleLike = useSetAtom(toggleLikeAtom);

  useEffect(() => {
    initLikes({ slug, initialLikes });
  }, [slug, initialLikes, initLikes]);

  return (
    <button
      onClick={() => toggleLike(slug)}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
        isLiked
          ? "text-pink-500 border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/30"
          : "text-foreground/50 border-black/10 dark:border-white/10 hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20"
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}
