import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { AlgorithmCodePanel } from "./algorithm-code-panel";

const SAMPLE_CODE = `function twoSum(nums, target) {
  const seen = new Map();
  return [];
}`;

const meta = {
  title: "Web/AlgorithmCodePanel",
  component: AlgorithmCodePanel,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AlgorithmCodePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    code: SAMPLE_CODE,
    language: "js",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("solution.js")).toBeInTheDocument();
    // 4줄짜리 코드 → 라인 넘버 1~4
    await expect(canvas.getByText("4")).toBeInTheDocument();
    await expect(canvas.queryByText("5")).not.toBeInTheDocument();
  },
};

export const CopiesCode: Story = {
  args: {
    code: SAMPLE_CODE,
    language: "js",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const writeText = fn(async () => {});
    Object.defineProperty(window.navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    await userEvent.click(canvas.getByRole("button", { name: /COPY/i }));

    await expect(writeText).toHaveBeenCalledWith(SAMPLE_CODE);
    await waitFor(() =>
      expect(canvas.getByText("COPIED!")).toBeInTheDocument(),
    );
  },
};

export const WithHighlightedHtml: Story = {
  args: {
    code: "const x = 1;",
    language: "ts",
    htmlLight:
      '<pre><code><span style="color:#005cc5">const</span> x = 1;</code></pre>',
    htmlDark:
      '<pre><code><span style="color:#79b8ff">const</span> x = 1;</code></pre>',
  },
  play: async ({ canvasElement }) => {
    // 하이라이트된 HTML이 주어지면 shiki 래퍼로 렌더링한다.
    await expect(canvasElement.querySelectorAll(".shiki-wrap")).toHaveLength(2);
  },
};
