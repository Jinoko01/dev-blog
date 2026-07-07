import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { AlgorithmListClient } from "./algorithm-list-client";

const makePosts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `problem-${i + 1}`,
    title: `Problem ${i + 1}`,
    date: "2026-01-01",
    description: "",
    tags: i % 2 === 0 ? ["array", "hash-table"] : ["graph", "bfs"],
    difficulty: i % 3 === 0 ? "골드1" : i % 3 === 1 ? "실버2" : "플레티넘3",
    platform: i % 2 === 0 ? "백준" : "LeetCode",
  }));

const meta = {
  title: "Web/AlgorithmListClient",
  component: AlgorithmListClient,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AlgorithmListClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { posts: makePosts(5) },
};

export const Paginated: Story = {
  args: { posts: makePosts(15) },
};

export const Empty: Story = {
  args: { posts: [] },
};

export const FiltersBySearch: Story = {
  args: { posts: makePosts(5) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByPlaceholderText("Search by title, tags, difficulty..."),
      "Problem 1",
    );

    await expect(canvas.getByText("1 results found")).toBeInTheDocument();
  },
};
