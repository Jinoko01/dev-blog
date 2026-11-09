import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useSearchParams } from "@storybook/nextjs-vite/navigation.mock";
import { useSyncExternalStore } from "react";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";

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
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <QueryProvider>
        <Story />
      </QueryProvider>
    ),
  ],
  beforeEach: () => {
    // 실제 앱에서는 Next.js가 replaceState 변경을 useSearchParams에 반영한다.
    const originalUrl = window.location.href;
    const originalState = window.history.state;
    const replaceState = window.history.replaceState.bind(window.history);
    const urlChanges = new EventTarget();
    const subscribe = (onChange: () => void) => {
      urlChanges.addEventListener("change", onChange);
      return () => urlChanges.removeEventListener("change", onChange);
    };
    const historyMock = spyOn(
      window.history,
      "replaceState",
    ).mockImplementation((state, title, url) => {
      replaceState(state, title, url);
      urlChanges.dispatchEvent(new Event("change"));
    });
    useSearchParams.mockImplementation(function useStorySearchParams() {
      const search = useSyncExternalStore(
        subscribe,
        () => window.location.search,
      );
      return new URLSearchParams(search) as ReturnType<typeof useSearchParams>;
    });

    const fetchMock = spyOn(window, "fetch").mockImplementation(
      async (input) => {
        const page = Number(
          new URL(
            input instanceof Request ? input.url : input,
            window.location.href,
          ).searchParams.get("page"),
        );
        return new Response(
          JSON.stringify({
            data: page > 3 ? [] : [stubbedApiArticle],
            count: 25,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    );
    return () => {
      fetchMock.mockRestore();
      useSearchParams.mockReset();
      historyMock.mockRestore();
      replaceState(originalState, "", originalUrl);
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
    await expect(
      new URLSearchParams(window.location.search).get("search"),
    ).toBe("zzz");
  },
};

export const FiltersFromUrl: Story = {
  args: {
    initialTags: ["React Native"],
    initialArticles: makeArticles(10),
    initialTotalCount: 25,
  },
  beforeEach: () => {
    const url = new URL(window.location.href);
    url.searchParams.set("search", "C++ (hooks)");
    url.searchParams.set("tag", "React Native");
    url.searchParams.set("sort", "popular");
    url.searchParams.set("page", "2");
    window.history.replaceState(null, "", url);
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Stubbed Result Article");
    await expect(window.fetch).toHaveBeenCalledWith(
      "/api/articles?search=C%2B%2B+%28hooks%29&tag=React+Native&sort=popular&page=2",
      expect.anything(),
    );
    await expect(canvas.getByPlaceholderText("Search articles...")).toHaveValue(
      "C++ (hooks)",
    );
    await expect(
      canvas.getByRole("button", { name: "React Native", pressed: true }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "popular", pressed: true }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "2", current: "page" }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "React Native" }));
    await canvas.findByRole("button", { name: "1", current: "page" });
    const params = new URLSearchParams(window.location.search);
    await expect(params.get("tag")).toBeNull();
    await expect(params.get("page")).toBeNull();
    await expect(params.get("search")).toBe("C++ (hooks)");
    await expect(params.get("sort")).toBe("popular");
    await userEvent.click(canvas.getByRole("button", { name: "React Native" }));
    await canvas.findByRole("button", { name: "React Native", pressed: true });
    await expect(new URLSearchParams(window.location.search).get("tag")).toBe(
      "React Native",
    );

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(canvas.getByPlaceholderText("Search articles...")).toHaveValue(
      "",
    );
    await expect(
      new URLSearchParams(window.location.search).get("search"),
    ).toBeNull();
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
    await expect(new URLSearchParams(window.location.search).get("page")).toBe(
      "2",
    );
    await expect(
      canvas.getByRole("button", { name: "2", current: "page" }),
    ).toBeInTheDocument();

    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState(null, "", url);

    await expect(await canvas.findByText("Article 1")).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "1", current: "page" }),
    ).toBeInTheDocument();

    url.searchParams.set("page", "4");
    window.history.replaceState(null, "", url);

    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).has("page")).toBe(
        false,
      ),
    );
    await expect(await canvas.findByText("Article 1")).toBeInTheDocument();

    url.searchParams.set("page", "2");
    window.history.replaceState(null, "", url);
    await canvas.findByRole("button", { name: "2", current: "page" });

    url.searchParams.set("page", "2.5");
    window.history.replaceState(null, "", url);
    await canvas.findByRole("button", { name: "1", current: "page" });

    await userEvent.click(canvas.getByRole("button", { name: "2" }));
    await userEvent.click(canvas.getByRole("button", { name: "popular" }));
    await canvas.findByRole("button", { name: "1", current: "page" });
    await expect(new URLSearchParams(window.location.search).has("page")).toBe(
      false,
    );
    await expect(new URLSearchParams(window.location.search).get("sort")).toBe(
      "popular",
    );
  },
};
