export type DifficultyTier = "hard" | "medium" | "easy";

export function getDifficultyTier(difficulty: string): DifficultyTier {
  const v = difficulty.toLowerCase();
  if (
    v.includes("플레") ||
    v.includes("d5") ||
    v.includes("lv4") ||
    v.includes("hard")
  ) {
    return "hard";
  }
  if (
    v.includes("골드") ||
    v.includes("d3") ||
    v.includes("d4") ||
    v.includes("lv2") ||
    v.includes("lv3") ||
    v.includes("medium")
  ) {
    return "medium";
  }
  return "easy";
}
