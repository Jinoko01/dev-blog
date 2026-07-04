"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deletePost as deletePostById,
  getPosts,
  togglePostPublish,
  type AdminPost,
} from "@/lib/api";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load posts");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function togglePublish(id: string) {
    await togglePostPublish(id);
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await deletePostById(id);
    fetchPosts();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
          Posts
        </h1>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[color:var(--color-primary)] text-white text-sm font-bold rounded-lg transition hover:opacity-90"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      <div
        className="overflow-hidden text-[14px]"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        {loading ? (
          <div className="p-8 text-center text-[13px] text-[color:var(--color-muted-foreground)]">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[color:var(--color-border)] rounded-lg m-4">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--color-muted-foreground)] mb-2">
              Empty
            </p>
            <p className="text-[13px] text-[color:var(--color-muted-foreground)]">
              No posts found. Create your first post to get started.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr
                style={{
                  background:
                    "color-mix(in oklch, var(--secondary) 60%, transparent)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {["Title", "Slug", "Date", "Status", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className="px-6 py-3.5"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground)",
                        textAlign: i === 4 ? "right" : "left",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]/50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-semibold text-[color:var(--color-foreground)]">
                    {post.title}
                  </td>
                  <td
                    className="px-6 py-3.5 text-[12px] text-[color:var(--color-muted-foreground)]"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {post.slug}
                  </td>
                  <td
                    className="px-6 py-3.5 text-[12px] text-[color:var(--color-muted-foreground)]"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {new Date(post.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => togglePublish(post.id)}
                      className="cursor-pointer px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-colors"
                      style={{
                        background: post.published
                          ? "rgba(22,163,74,0.12)"
                          : "rgba(217,119,6,0.12)",
                        color: post.published ? "#15803d" : "#b45309",
                      }}
                    >
                      {post.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="p-2 rounded text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-primary)] transition-colors"
                        aria-label="Edit"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 rounded text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-destructive)] transition-colors cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
