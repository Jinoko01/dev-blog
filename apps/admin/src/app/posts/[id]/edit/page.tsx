"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostForAdmin, updatePost } from "@/lib/api";
import { PostForm, type PostFormValues } from "@/components/post-form";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [slug, setSlug] = useState("");
  const [initialValues, setInitialValues] = useState<PostFormValues | null>(
    null,
  );

  useEffect(() => {
    if (!postId) {
      return;
    }

    async function loadPost() {
      const post = await getPostForAdmin(postId).catch((error) => {
        alert(
          "Failed to load post: " +
            (error instanceof Error ? error.message : "Not found"),
        );
        router.push("/posts");
        return null;
      });

      if (!post) {
        return;
      }

      setSlug(post.slug);
      setInitialValues({
        title: post.title,
        description: post.description || "",
        content: post.content || "",
        thumbnail_url: post.thumbnail_url || "",
        tags: post.tags.join(", "),
        published: post.published || false,
      });
    }

    loadPost();
  }, [postId, router]);

  async function handleUpdate(values: PostFormValues) {
    const tagsArray = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await updatePost(postId, { ...values, slug, tags: tagsArray });
      router.push("/posts");
    } catch (error) {
      alert(
        "Error saving post: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  if (!initialValues) {
    return (
      <div className="max-w-3xl mx-auto pt-10 text-center text-[13px] text-[color:var(--color-muted-foreground)]">
        Loading post data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
        Edit Post
      </h1>

      <PostForm
        initialValues={initialValues}
        slug={slug}
        submitLabel="Save Changes"
        pendingLabel="Saving Changes..."
        onSubmit={handleUpdate}
      />
    </div>
  );
}
