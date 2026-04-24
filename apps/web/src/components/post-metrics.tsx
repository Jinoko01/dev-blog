"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, Eye } from "lucide-react";

/** views 표시 + view 카운트 증가 + likes 읽기 */
function usePostMetrics(slug: string) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const initMetrics = async () => {
      const { data } = await supabase
        .from("post_metrics")
        .select("*")
        .eq("slug", slug)
        .single();

      let currentViews = data ? data.views : 0;
      const currentLikes = data ? data.likes : 0;

      if (!data) {
        await supabase
          .from("post_metrics")
          .insert({ slug, views: 0, likes: 0 });
      }

      const today = new Date().toISOString().split("T")[0];
      const viewKey = `viewed_${slug}_${today}`;
      const likedKey = `liked_${slug}`;

      // [js-cache-storage] Read localStorage once per key and reuse the cached value
      const hasViewed = localStorage.getItem(viewKey);
      const hasLiked = localStorage.getItem(likedKey);

      if (!hasViewed) {
        const { error } = await supabase.rpc("increment_view_count", { post_slug: slug });
        if (!error) {
          currentViews += 1;
          localStorage.setItem(viewKey, "true");
        } else {
          // Fallback if RPC doesn't exist
          currentViews += 1;
          await supabase
            .from("post_metrics")
            .update({ views: currentViews })
            .eq("slug", slug);
          localStorage.setItem(viewKey, "true");
        }
      }

      setViews(currentViews);
      setLikes(currentLikes);

      // [js-cache-storage] Reuse cached hasLiked value instead of a second localStorage read
      // if (hasLiked) {
      //   setIsLiked(true);
      // }
    };

    initMetrics();
  }, [slug]);

  return { views, likes };
}

/** likes 읽기 + like 버튼 액션 전용 (view 증가 없음) */
function useLikeMetrics(slug: string) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("post_metrics")
        .select("likes")
        .eq("slug", slug)
        .single();

      if (data) setLikes(data.likes);
      if (localStorage.getItem(`liked_${slug}`)) setIsLiked(true);
    };

    fetchLikes();
  }, [slug]);

  const handleLike = async () => {
    if (isLiked) return;

    setIsLiked(true);
    localStorage.setItem(`liked_${slug}`, "true");
    setLikes((prev) => prev + 1);

    const { error } = await supabase.rpc("increment_like_count", {
      post_slug: slug,
    });
    if (error) {
      // Fallback
      const { data } = await supabase
        .from("post_metrics")
        .select("likes")
        .eq("slug", slug)
        .single();
      if (data) {
        await supabase
          .from("post_metrics")
          .update({ likes: data.likes + 1 })
          .eq("slug", slug);
      }
    }
  };

  return { likes, isLiked, handleLike };
}

/** header description 아래에 views/likes 수치를 텍스트로 표시하는 컴포넌트 */
export function PostMetricsDisplay({ slug }: { slug: string }) {
  const { views, likes } = usePostMetrics(slug);

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
      disabled={isLiked}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${isLiked
          ? "text-pink-500 border-pink-300 dark:border-pink-700 bg-pink-50 dark:bg-pink-950/30"
          : "text-foreground/50 border-black/10 dark:border-white/10 hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20"
        }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}
