"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  incrementPostLike,
  decrementPostLike,
  incrementPostView,
} from "@/lib/api";
import { Heart, Eye } from "lucide-react";

/** views 표시 + view 카운트 증가 + likes 읽기 */
function usePostMetrics(
  slug: string,
  initialViews: number,
  initialLikes: number,
) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    const initMetrics = async () => {
      const today = new Date().toISOString().split("T")[0];
      const viewKey = `viewed_${slug}_${today}`;

      if (!localStorage.getItem(viewKey)) {
        const metrics = await incrementPostView(slug);
        setViews(metrics.views);
        setLikes(metrics.likes);
        localStorage.setItem(viewKey, "true");
      }
    };

    initMetrics();
  }, [slug]);

  return { views, likes };
}

/** likes 읽기 + like 버튼 액션 전용 (view 증가 없음) */
function useLikeMetrics(slug: string, initialLikes: number) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(Boolean(localStorage.getItem(`liked_${slug}`)));
  }, [slug]);

  const { mutate, isPending } = useMutation({
    mutationFn: (liked: boolean) =>
      liked ? decrementPostLike(slug) : incrementPostLike(slug),
    onMutate: (liked: boolean) => {
      // 낙관적 업데이트
      const nextLiked = !liked;
      setIsLiked(nextLiked);
      setLikes((prev) => (prev ?? 0) + (nextLiked ? 1 : -1));
      if (nextLiked) {
        localStorage.setItem(`liked_${slug}`, "true");
      } else {
        localStorage.removeItem(`liked_${slug}`);
      }
    },
    onError: (_err, liked: boolean) => {
      // 실패 시 롤백
      setIsLiked(liked);
      setLikes((prev) => (prev ?? 0) + (liked ? 1 : -1));
      if (liked) {
        localStorage.setItem(`liked_${slug}`, "true");
      } else {
        localStorage.removeItem(`liked_${slug}`);
      }
    },
    onSuccess: (data) => {
      setLikes(data.likes);
    },
  });

  const handleLike = () => {
    if (isPending) return;
    mutate(isLiked);
  };

  return { likes, isLiked, handleLike, isPending };
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
  const { views, likes } = usePostMetrics(slug, initialViews, initialLikes);

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
  const { likes, isLiked, handleLike, isPending } = useLikeMetrics(
    slug,
    initialLikes,
  );

  return (
    <button
      onClick={handleLike}
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
