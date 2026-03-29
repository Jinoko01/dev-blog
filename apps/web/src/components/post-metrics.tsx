"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, Eye } from "lucide-react";

export function PostMetrics({ slug }: { slug: string }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const initMetrics = async () => {
      const { data } = await supabase
        .from("post_metrics")
        .select("*")
        .eq("slug", slug)
        .single();

      let currentViews = data ? data.views : 0;
      let currentLikes = data ? data.likes : 0;

      if (!data) {
        await supabase
          .from("post_metrics")
          .insert({ slug, views: 0, likes: 0 });
      }

      const today = new Date().toISOString().split('T')[0];
      const viewKey = `viewed_${slug}_${today}`;

      if (!localStorage.getItem(viewKey)) {
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

      if (localStorage.getItem(`liked_${slug}`)) {
        setIsLiked(true);
      }
    };

    initMetrics();
  }, [slug]);

  const handleLike = async () => {
    if (isLiked) return;

    setIsLiked(true);
    localStorage.setItem(`liked_${slug}`, "true");
    setLikes((prev) => prev + 1);

    const { error } = await supabase.rpc("increment_like_count", { post_slug: slug });
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

  return (
    <div className="flex items-center gap-6 py-6 border-y border-black/5 dark:border-white/10 my-12 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-2xl px-6 w-fit shadow-sm">
      <div className="flex items-center gap-2 text-foreground/70">
        <Eye className="w-5 h-5 text-brand-500" />
        <span className="font-semibold text-lg">{views}</span>{" "}
        <span className="text-sm">views</span>
      </div>
      <div className="w-px h-6 bg-black/10 dark:bg-white/10" />
      <button
        onClick={handleLike}
        disabled={isLiked}
        className={`flex items-center gap-2 transition-all cursor-pointer ${isLiked ? "text-pink-500 scale-105" : "text-foreground/70 hover:text-pink-400 hover:scale-105 active:scale-95"}`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="font-semibold text-lg">{likes}</span>{" "}
        <span className="text-sm">likes</span>
      </button>
    </div>
  );
}
