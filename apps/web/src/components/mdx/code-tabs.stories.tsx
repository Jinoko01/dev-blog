import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { CodeTabs, CodeTab } from "./code-tabs";

const meta = {
  title: "Web/Mdx/CodeTabs",
  component: CodeTabs,
} satisfies Meta<typeof CodeTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SwitchesTabs: Story = {
  args: {
    tabs: "npm, pnpm",
    children: (
      <>
        <CodeTab title="npm">npm install react</CodeTab>
        <CodeTab title="pnpm">pnpm add react</CodeTab>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 첫 번째 탭이 기본 활성화된다.
    await expect(canvas.getByText("npm install react")).toBeVisible();
    await expect(canvas.getByText("pnpm add react")).not.toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "pnpm" }));

    await expect(canvas.getByText("pnpm add react")).toBeVisible();
    await expect(canvas.getByText("npm install react")).not.toBeVisible();
  },
};

export const StringifiedArrayTabs: Story = {
  args: {
    tabs: "['yarn', 'bun']",
    children: (
      <>
        <CodeTab title="yarn">yarn add react</CodeTab>
        <CodeTab title="bun">bun add react</CodeTab>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // "['a', 'b']" 형태의 문자열도 탭 배열로 파싱된다.
    await expect(
      canvas.getByRole("button", { name: "yarn" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "bun" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("yarn add react")).toBeVisible();
  },
};

export const MissingTabsShowsError: Story = {
  args: {
    children: <CodeTab title="npm">npm install react</CodeTab>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText(/Error: CodeTabs requires a 'tabs' array/),
    ).toBeInTheDocument();
  },
};
