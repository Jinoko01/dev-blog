"use client";

import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
import { PostForm, type PostFormValues } from "@/components/post-form";

function generateSlug(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 16 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
}

export default function NewPostPage() {
  const router = useRouter();

  async function handleCreate(values: PostFormValues) {
    const tagsArray = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createPost({
        ...values,
        slug: generateSlug(),
        tags: tagsArray,
      });
      router.push("/posts");
    } catch (error) {
      alert(
        "Error saving post: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
        Create New Post
      </h1>

      <PostForm
        submitLabel="Save Post"
        pendingLabel="Saving..."
        publishLabel="Publish immediately"
        onSubmit={handleCreate}
      />
    </div>
  );
}
