import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";

import { PostList } from "./post-list";

const makePosts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    title: `Post ${i + 1}`,
    date: "2026-01-01",
    description: `Description of post ${i + 1}`,
    tags: ["react", "nextjs"],
    slug: `post-${i + 1}`,
  }));

const meta = {
  title: "Web/PostList",
  component: PostList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { allPosts: makePosts(5) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 6개 미만이면 전부 렌더링되고 무한 스크롤 스피너가 없다.
    await expect(canvas.getByText("Post 1")).toBeInTheDocument();
    await expect(canvas.getByText("Post 5")).toBeInTheDocument();
    await expect(canvasElement.querySelector(".animate-spin")).toBeNull();
  },
};

export const FigmaVariant: Story = {
  args: {
    allPosts: makePosts(4).map((post) => ({
      ...post,
      thumbnailUrl: null,
      views: 12,
      likes: 3,
    })),
    variant: "figma",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Post 1")).toBeInTheDocument();
    // figma variant는 views/likes 메타를 표시한다.
    await expect(canvas.getAllByText("12")).toHaveLength(4);
    await expect(canvas.getAllByText("3")).toHaveLength(4);
  },
};

export const LazyLoadsMorePosts: Story = {
  args: { allPosts: makePosts(12) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Post 6")).toBeInTheDocument();

    // 센티널(스피너)을 뷰포트에 노출시키면 다음 페이지가 로드된다.
    const sentinel = canvasElement.querySelector(".animate-spin");
    await expect(sentinel).not.toBeNull();
    sentinel!.scrollIntoView();

    await waitFor(
      () => expect(canvas.getByText("Post 12")).toBeInTheDocument(),
      { timeout: 3000 },
    );
  },
};
