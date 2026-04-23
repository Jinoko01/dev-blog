"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail_url: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    if (!postId) {
      return;
    }

    async function loadPost() {
      // Fetch Post
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !post) {
        alert("Failed to load post: " + (error?.message || "Not found"));
        router.push("/posts");
        return;
      }

      // Fetch Tags
      const { data: tagsData } = await supabase
        .from("post_tags")
        .select(
          `
          tags ( name )
        `,
        )
        .eq("post_id", postId);

      let tagsString = "";
      if (tagsData) {
        // Handle post_tags returning array containing tags object
        const tagNames = tagsData
          .map((pt: any) => pt.tags?.name)
          .filter(Boolean);
        tagsString = tagNames.join(", ");
      }

      setFormData({
        title: post.title,
        slug: post.slug,
        description: post.description || "",
        content: post.content || "",
        thumbnail_url: post.thumbnail_url || "",
        tags: tagsString,
        published: post.published || false,
      });

      setFetching(false);
    }

    loadPost();
  }, [postId, router]);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      const { token, path, error: apiError } = await res.json();
      if (apiError || !token || !path) {
        throw new Error(apiError || "Failed to get upload token");
      }

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw new Error("Supabase Storage Error: " + uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(path);

      return publicUrl;
    } catch (err: unknown) {
      console.error(err);
      alert(
        "Upload failed: " + (err instanceof Error ? err.message : String(err)),
      );
      return "";
    }
  };

  const processMarkdownFiles = async (
    files: File[],
    textarea: HTMLTextAreaElement,
  ) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      return;
    }

    for (const file of imageFiles) {
      const cursorPosition = textarea.selectionStart;
      const placeholder = `![Uploading ${file.name}...]()\n`;

      setFormData((prev) => {
        const textBefore = prev.content.substring(0, cursorPosition);
        const textAfter = prev.content.substring(cursorPosition);
        return { ...prev, content: textBefore + placeholder + textAfter };
      });

      setUploadingImage(true);
      const publicUrl = await uploadImageToSupabase(file);
      setUploadingImage(false);

      if (publicUrl) {
        setFormData((prev) => ({
          ...prev,
          content: prev.content.replace(
            placeholder,
            `![${file.name}](${publicUrl})\n`,
          ),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          content: prev.content.replace(placeholder, ""),
        }));
      }
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("posts")
      .update({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        thumbnail_url: formData.thumbnail_url,
        published: formData.published,
      })
      .eq("id", postId);

    if (error) {
      alert("Error saving post: " + error.message);
      setLoading(false);
      return;
    }

    // Replace old tags completely by deleting and recreating the mappings
    await supabase.from("post_tags").delete().eq("post_id", postId);

    if (tagsArray.length > 0) {
      await supabase.from("tags").upsert(
        tagsArray.map((name) => ({ name })),
        { onConflict: "name", ignoreDuplicates: true },
      );

      const { data: dbTags } = await supabase
        .from("tags")
        .select("id")
        .in("name", tagsArray);

      if (dbTags && dbTags.length > 0) {
        await supabase
          .from("post_tags")
          .insert(dbTags.map((t) => ({ post_id: postId, tag_id: t.id })));
      }
    }

    setLoading(false);
    router.push("/posts");
  }

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-10 text-center text-gray-500">
        Loading post data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Next.js 14 App Router Guide"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            readOnly
            disabled
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-gray-50 focus:ring-0 transition"
            value={formData.slug}
            placeholder="nextjs-14-guide"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition h-20"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief summary of the post..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail Image</label>
          <div className="flex flex-col gap-3">
            {formData.thumbnail_url && (
              <img
                src={formData.thumbnail_url}
                alt="Thumbnail preview"
                className="w-32 h-auto object-cover rounded-md border border-gray-200"
              />
            )}
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition disabled:opacity-50 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadingImage(true);
                    const publicUrl = await uploadImageToSupabase(file);
                    if (publicUrl) {
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_url: publicUrl,
                      }));
                    }
                    setUploadingImage(false);
                  }
                }}
              />
              {uploadingImage && (
                <span className="text-sm text-blue-600 animate-pulse font-medium whitespace-nowrap">
                  Uploading...
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Or provide a URL:
            </p>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react, nextjs, frontend"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Markdown Content</label>
            <span className="text-xs text-gray-500 font-medium">
              Drop/Paste images directly inside
            </span>
          </div>
          <textarea
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition h-96 font-mono text-sm"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            onDrop={async (e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              await processMarkdownFiles(files, e.currentTarget);
            }}
            onPaste={async (e) => {
              const files = Array.from(e.clipboardData.files);
              if (
                files.length > 0 &&
                files.some((f) => f.type.startsWith("image/"))
              ) {
                e.preventDefault();
                await processMarkdownFiles(files, e.currentTarget);
              }
            }}
            placeholder={`## Hello World...\n\nDrag & drop or paste images directly into this area to upload them!`}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish status
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
