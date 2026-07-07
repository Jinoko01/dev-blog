"use client";

import { useState } from "react";
import {
  createSignedUploadUrl,
  getPublicUrlFromSignedUploadUrl,
} from "@/lib/api";

export type PostFormValues = {
  title: string;
  description: string;
  content: string;
  thumbnail_url: string;
  tags: string;
  published: boolean;
};

const DEFAULT_VALUES: PostFormValues = {
  title: "",
  description: "",
  content: "",
  thumbnail_url: "",
  tags: "",
  published: false,
};

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]";
const labelCls =
  "text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-muted-foreground)]";

async function uploadImage(file: File): Promise<string> {
  try {
    const upload = await createSignedUploadUrl(file.name);
    const uploadResponse = await fetch(upload.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!uploadResponse.ok) {
      throw new Error("Storage upload failed");
    }
    return getPublicUrlFromSignedUploadUrl(upload.signedUrl, upload.path);
  } catch (err: unknown) {
    console.error(err);
    alert(
      "Upload failed: " + (err instanceof Error ? err.message : String(err)),
    );
    return "";
  }
}

export function PostForm({
  initialValues = DEFAULT_VALUES,
  slug,
  submitLabel,
  pendingLabel,
  publishLabel = "Publish status",
  onSubmit,
}: {
  initialValues?: PostFormValues;
  /** Edit 모드일 때만 전달되며, 읽기 전용 Slug 필드를 표시한다. */
  slug?: string;
  submitLabel: string;
  pendingLabel: string;
  publishLabel?: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<PostFormValues>(initialValues);

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
      const publicUrl = await uploadImage(file);
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
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[color:var(--color-card)] p-6 md:p-8 rounded-lg border border-[color:var(--color-border)] shadow-sm flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Title</label>
        <input
          required
          className={inputCls}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Next.js 14 App Router Guide"
        />
      </div>

      {slug !== undefined && (
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Slug</label>
          <input
            readOnly
            disabled
            className={`${inputCls} bg-[color:var(--color-secondary)] opacity-70 cursor-not-allowed`}
            value={slug}
            placeholder="nextjs-14-guide"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} h-20 resize-none`}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief summary of the post..."
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className={labelCls}>Thumbnail Image</label>
        {formData.thumbnail_url && (
          <img
            src={formData.thumbnail_url}
            alt="Thumbnail preview"
            className="w-32 h-auto object-cover rounded-lg border border-[color:var(--color-border)]"
          />
        )}
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            className="block w-full text-sm text-[color:var(--color-muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[color:var(--color-secondary)] file:text-[color:var(--color-foreground)] hover:file:bg-[color:var(--color-secondary)]/80 transition disabled:opacity-50 cursor-pointer"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUploadingImage(true);
                const publicUrl = await uploadImage(file);
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
            <span className="text-sm text-[color:var(--color-primary)] animate-pulse font-medium whitespace-nowrap">
              Uploading...
            </span>
          )}
        </div>
        <p className={labelCls}>Or provide a URL:</p>
        <input
          className={inputCls}
          value={formData.thumbnail_url}
          onChange={(e) =>
            setFormData({ ...formData, thumbnail_url: e.target.value })
          }
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Tags (comma separated)</label>
        <input
          className={inputCls}
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, nextjs, frontend"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className={labelCls}>Markdown Content</label>
          <span className="text-[11px] text-[color:var(--color-muted-foreground)]">
            Drop/Paste images directly inside
          </span>
        </div>
        <textarea
          required
          className={`${inputCls} h-96 font-mono text-sm resize-none`}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          onDrop={async (e) => {
            e.preventDefault();
            await processMarkdownFiles(
              Array.from(e.dataTransfer.files),
              e.currentTarget,
            );
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

      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) =>
            setFormData({ ...formData, published: e.target.checked })
          }
          className="w-4 h-4 accent-[color:var(--color-primary)] rounded cursor-pointer"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium cursor-pointer select-none"
        >
          {publishLabel}
        </label>
      </div>

      <div className="pt-4 border-t border-[color:var(--color-border)]">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[color:var(--color-primary)] text-white font-bold text-sm rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
