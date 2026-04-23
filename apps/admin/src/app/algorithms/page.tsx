"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AlgorithmsPage() {
  const [algos, setAlgos] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAlgos() {
    setLoading(true);
    const { data } = await supabase
      .from("algorithms")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAlgos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAlgos();
  }, []);

  async function togglePublish(id: string, current: boolean) {
    await supabase
      .from("algorithms")
      .update({ published: !current })
      .eq("id", id);
    fetchAlgos();
  }

  async function deleteAlgo(id: string) {
    if (!confirm("Are you sure you want to delete this archive?")) {
      return;
    }
    await supabase.from("algorithms").delete().eq("id", id);
    fetchAlgos();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Algorithm Archives
        </h1>
        <Link
          href="/algorithms/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} />
          <span>New Archive</span>
        </Link>
      </div>

      <div className="bg-white border text-sm border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading algorithms...
          </div>
        ) : algos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No algorithms found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-medium text-gray-600">Title</th>
                <th className="px-6 py-4 font-medium text-gray-600">
                  Platform
                </th>
                <th className="px-6 py-4 font-medium text-gray-600">
                  Difficulty
                </th>
                <th className="px-6 py-4 font-medium text-gray-600">Lang</th>
                <th className="px-6 py-4 font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {algos.map((algo) => (
                <tr key={algo.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{algo.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {algo.platform || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {algo.difficulty || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{algo.language}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(algo.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(algo.id, algo.published)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        algo.published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {algo.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/algorithms/${algo.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteAlgo(algo.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
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
