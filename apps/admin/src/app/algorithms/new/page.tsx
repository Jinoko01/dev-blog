"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

    const { error } = await supabase.from("algorithms").insert([
      {
        title: formData.title,
        platform: formData.platform,
        difficulty: formData.difficulty,
        language: formData.language,
        description: formData.description,
        code: formData.code,
        tags: tagsArray,
        published: formData.published,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error saving algorithm: " + error.message);
    } else {
      router.push("/algorithms");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Create Algorithm Archive
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (Problem Name)</label>
          <input
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Two Sum (LeetCode 1)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <input
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              placeholder="e.g., 골드1, D3, LV2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
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

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Approach / Description (Markdown allowed)
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition h-32"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="How to solve this problem..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="array, hash-table, easy"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Code Solution</label>
          <textarea
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition h-64 font-mono text-sm leading-relaxed"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="function twoSum(nums: number[], target: number): number[] { ... }"
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
            Publish immediately
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Archive"}
          </button>
        </div>
      </form>
    </div>
  );
}
