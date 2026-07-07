"use client";

import { useRouter } from "next/navigation";
import { createAlgorithm } from "@/lib/api";
import {
  AlgorithmForm,
  type AlgorithmFormValues,
} from "@/components/algorithm-form";

export default function NewAlgorithmPage() {
  const router = useRouter();

  async function handleCreate(values: AlgorithmFormValues) {
    const tagsArray = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createAlgorithm({ ...values, tags: tagsArray });
      router.push("/algorithms");
    } catch (error) {
      alert(
        "Error saving algorithm: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight text-[color:var(--color-foreground)]">
        Create Algorithm Archive
      </h1>

      <AlgorithmForm
        submitLabel="Save Archive"
        pendingLabel="Saving..."
        publishLabel="Publish immediately"
        onSubmit={handleCreate}
      />
    </div>
  );
}
