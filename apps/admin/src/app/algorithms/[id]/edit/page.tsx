"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAlgorithm, updateAlgorithm } from "@/lib/api";
import {
  AlgorithmForm,
  type AlgorithmFormValues,
} from "@/components/algorithm-form";

export default function EditAlgorithmPage() {
  const router = useRouter();
  const params = useParams();
  const algoId = params.id as string;

  const [initialValues, setInitialValues] =
    useState<AlgorithmFormValues | null>(null);

  useEffect(() => {
    if (!algoId) {
      return;
    }

    async function loadAlgorithm() {
      const algo = await getAlgorithm(algoId).catch((error) => {
        alert(
          "Failed to load algorithm: " +
            (error instanceof Error ? error.message : "Not found"),
        );
        router.push("/algorithms");
        return null;
      });

      if (!algo) {
        return;
      }

      setInitialValues({
        title: algo.title,
        platform: algo.platform || "백준",
        difficulty: algo.difficulty || "",
        language: algo.language || "typescript",
        description: algo.description || "",
        code: algo.code || "",
        tags: (algo.tags || []).join(", "),
        published: algo.published || false,
      });
    }

    loadAlgorithm();
  }, [algoId, router]);

  async function handleUpdate(values: AlgorithmFormValues) {
    const tagsArray = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await updateAlgorithm(algoId, { ...values, tags: tagsArray });
      router.push("/algorithms");
    } catch (error) {
      alert(
        "Error updating algorithm: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  if (!initialValues) {
    return (
      <div className="max-w-3xl mx-auto pt-10 text-center text-[13px] text-[color:var(--color-muted-foreground)]">
        Loading algorithm data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
        Edit Algorithm Archive
      </h1>

      <AlgorithmForm
        initialValues={initialValues}
        submitLabel="Save Changes"
        pendingLabel="Saving Changes..."
        onSubmit={handleUpdate}
      />
    </div>
  );
}
