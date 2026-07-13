import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ArticlesClient } from "./articles-client";
import { QueryProvider } from "@/components/query-provider";
import type { ArticleListItem } from "@/lib/api";

const makeArticles = (count: number): ArticleListItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `article-${i + 1}`,
    title: `Article ${i + 1}`,
    slug: `article-${i + 1}`,
    description: `Description of article ${i + 1}`,
    thumbnailUrl: null,
    createdAt: "2026-01-01T00:00:00Z",
    views: i * 10,
    likes: i,
    tags: i % 2 === 0 ? ["react"] : ["nextjs"],
  }));

// 필터/정렬/페이지 변경 시 클라이언트에서 /api/articles를 호출하므로 fetch를 스텁한다.
const stubbedApiArticle = {
  id: "stub-1",
  title: "Stubbed Result Article",
  slug: "stubbed-result",
  description: "Returned from the stubbed fetch.",
  thumbnail_url: null,
  created_at: "2026-02-01T00:00:00Z",
  views: 99,
  likes: 9,
  tags: ["stub"],
};

const meta = {
  title: "Web/ArticlesClient",
  component: ArticlesClient,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <QueryProvider>
        <Story />
      </QueryProvider>
    ),
  ],
  beforeEach: () => {
    const originalFetch = window.fetch;
    window.fetch = (async () =>
      new Response(JSON.stringify({ data: [stubbedApiArticle], count: 25 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as typeof window.fetch;
    return () => {
      window.fetch = originalFetch;
    };
  },
} satisfies Meta<typeof ArticlesClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialTags: ["nextjs", "react"],
    initialArticles: makeArticles(3),
    initialTotalCount: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("3 articles found")).toBeInTheDocument();
    await expect(canvas.getByText("Article 1")).toBeInTheDocument();
    await expect(canvas.getByText("Article 3")).toBeInTheDocument();
    // 태그 필터 버튼: ALL + 전달된 태그
    await expect(
      canvas.getByRole("button", { name: "ALL" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "react" }),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    initialTags: [],
    initialArticles: [],
    initialTotalCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("0 articles found")).toBeInTheDocument();
    await expect(
      canvas.getByText(/No articles found matching/),
    ).toBeInTheDocument();
  },
};

export const SearchRefetchesArticles: Story = {
  args: {
    initialTags: ["react"],
    initialArticles: makeArticles(3),
    initialTotalCount: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 검색어 입력 → 300ms 디바운스 후 스텁된 fetch 결과로 목록이 교체된다.
    await userEvent.type(
      canvas.getByPlaceholderText("Search articles..."),
      "zzz",
    );

    await waitFor(
      () =>
        expect(canvas.getByText("Stubbed Result Article")).toBeInTheDocument(),
      { timeout: 3000 },
    );
    await expect(canvas.queryByText("Article 1")).not.toBeInTheDocument();
  },
};

export const PaginationRefetchesArticles: Story = {
  args: {
    initialTags: [],
    initialArticles: makeArticles(10),
    initialTotalCount: 25,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 25건 / 페이지당 10건 → 3페이지
    await expect(canvas.getByRole("button", { name: "3" })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "2" }));

    await waitFor(
      () =>
        expect(canvas.getByText("Stubbed Result Article")).toBeInTheDocument(),
      { timeout: 3000 },
    );
  },
};
