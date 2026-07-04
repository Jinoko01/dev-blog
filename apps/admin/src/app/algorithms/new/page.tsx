"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAlgorithm } from "@/lib/api";

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]";
const labelCls =
  "text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-muted-foreground)]";

export default function NewAlgorithmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    platform: "백준",
    difficulty: "",
    language: "typescript",
    description: "",
    code: "",
    tags: "",
    published: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createAlgorithm({
        title: formData.title,
        platform: formData.platform,
        difficulty: formData.difficulty,
        language: formData.language,
        description: formData.description,
        code: formData.code,
        tags: tagsArray,
        published: formData.published,
      });
      router.push("/algorithms");
    } catch (error) {
      alert(
        "Error saving algorithm: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
        Create Algorithm Archive
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[color:var(--color-card)] p-6 md:p-8 rounded-lg border border-[color:var(--color-border)] shadow-sm flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Title (Problem Name)</label>
          <input
            required
            className={inputCls}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Two Sum (LeetCode 1)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Platform</label>
            <select
              className={`${inputCls} bg-[color:var(--color-background)]`}
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            >
              <option value="백준">백준</option>
              <option value="SWEA">SWEA</option>
              <option value="프로그래머스">프로그래머스</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Difficulty</label>
            <input
              required
              className={inputCls}
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              placeholder="e.g., 골드1, D3, LV2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Language</label>
          <select
            className={`${inputCls} bg-[color:var(--color-background)]`}
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Approach / Description (Markdown allowed)</label>
          <textarea
            className={`${inputCls} h-32 resize-none`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="How to solve this problem..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Tags (comma separated)</label>
          <input
            className={inputCls}
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="array, hash-table, easy"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Code Solution</label>
          <textarea
            required
            className={`${inputCls} h-64 font-mono text-sm resize-none leading-relaxed`}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="function twoSum(nums: number[], target: number): number[] { ... }"
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
            Publish immediately
          </label>
        </div>

        <div className="pt-4 border-t border-[color:var(--color-border)]">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[color:var(--color-primary)] text-white font-bold text-sm rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : "Save Archive"}
          </button>
        </div>
      </form>
    </div>
  );
}
