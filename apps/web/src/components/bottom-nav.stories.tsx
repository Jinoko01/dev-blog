import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { BottomNav } from "./bottom-nav";

const meta = {
  title: "Web/BottomNav",
  component: BottomNav,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// sm:hidden 컴포넌트라 데스크톱 뷰포트에서는 display:none이므로
// 접근성 쿼리 대신 DOM 쿼리로 활성 상태를 검증한다.
const getLink = (root: HTMLElement, href: string) =>
  root.querySelector(`a[href="${href}"]`);

export const HomeActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
  play: async ({ canvasElement }) => {
    await expect(getLink(canvasElement, "/")?.className).toContain(
      "text-primary",
    );
    await expect(getLink(canvasElement, "/articles")?.className).not.toContain(
      "text-primary",
    );
  },
};

export const ArticlesActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/articles/some" } },
  },
  play: async ({ canvasElement }) => {
    await expect(getLink(canvasElement, "/articles")?.className).toContain(
      "text-primary",
    );
    await expect(getLink(canvasElement, "/")?.className).not.toContain(
      "text-primary",
    );
  },
};
