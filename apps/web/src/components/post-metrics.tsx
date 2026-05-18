"use client";

import { useEffect, useState } from "react";
import { getPost, incrementPostLike, incrementPostView } from "@/lib/api";
import { Heart, Eye } from "lucide-react";

/** views 표시 + view 카운트 증가 + likes 읽기 */
function usePostMetrics(slug: string) {
  const [views, setViews] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    const initMetrics = async () => {
      const post = await getPost(slug);
      let currentViews = post.views || 0;
      let currentLikes = post.likes || 0;

      const today = new Date().toISOString().split("T")[0];
      const viewKey = `viewed_${slug}_${today}`;

      const hasViewed = localStorage.getItem(viewKey);

      if (!hasViewed) {
        const metrics = await incrementPostView(slug);
        currentViews = metrics.views;
        currentLikes = metrics.likes;
        localStorage.setItem(viewKey, "true");
      }

      setViews(currentViews);
      setLikes(currentLikes);
    };

    initMetrics();
  }, [slug]);

  return { views, likes };
}

/** likes 읽기 + like 버튼 액션 전용 (view 증가 없음) */
function useLikeMetrics(slug: string) {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const post = await getPost(slug);
      setLikes(post.likes || 0);
      if (localStorage.getItem(`liked_${slug}`)) {
        setIsLiked(true);
      }
    };

    fetchLikes();
  }, [slug]);

  const handleLike = async () => {
    if (isLiked) {
      return;
    }

    setIsLiked(true);
    localStorage.setItem(`liked_${slug}`, "true");
    setLikes((prev) => (prev ?? 0) + 1);

    await incrementPostLike(slug);
  };

  return { likes, isLiked, handleLike };
}

/** header description 아래에 views/likes 수치를 텍스트로 표시하는 컴포넌트 */
export function PostMetricsDisplay({ slug }: { slug: string }) {
  const { views, likes } = usePostMetrics(slug);
  const isLoading = views === null || likes === null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 text-sm mt-4">
        <span className="flex items-center gap-1.5 opacity-80">
          <Eye className="w-4 h-4" />
          <span className="w-8 h-4 rounded bg-current opacity-20 animate-pulse inline-block" />
          <span className="opacity-70">views</span>
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1.5 opacity-80">
          <Heart className="w-4 h-4" />
          <span className="w-6 h-4 rounded bg-current opacity-20 animate-pulse inline-block" />
          <span className="opacity-70">likes</span>
        </span>
      </div>
    );
  }

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
export function PostLikeButton({ slug }: { slug: string }) {
  const { likes, isLiked, handleLike } = useLikeMetrics(slug);

  return (
    <button
      onClick={handleLike}
      disabled={isLiked || likes === null}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
        isLiked
          ? "text-pink-500 border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/30"
          : "text-foreground/50 border-black/10 dark:border-white/10 hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20"
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      {likes === null ? (
        <span className="w-4 h-3.5 rounded bg-current opacity-20 animate-pulse inline-block" />
      ) : (
        <span>{likes}</span>
      )}
    </button>
  );
}
