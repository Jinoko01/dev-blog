import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Header } from "./header";

const meta = {
  title: "Web/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("link", { name: "OKOJIN" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      canvas.getByRole("link", { name: "GitHub" }),
    ).toBeInTheDocument();
  },
};

export const ArticlesActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/articles" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 현재 경로에 해당하는 메뉴만 활성 색상(text-primary)을 가진다.
    await expect(canvas.getByRole("link", { name: "ARTICLES" })).toHaveClass(
      "text-primary",
    );
    await expect(
      canvas.getByRole("link", { name: "ALGORITHMS" }),
    ).not.toHaveClass("text-primary");
  },
};

export const AlgorithmsActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/algorithm" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("link", { name: "ALGORITHMS" })).toHaveClass(
      "text-primary",
    );
    await expect(
      canvas.getByRole("link", { name: "ARTICLES" }),
    ).not.toHaveClass("text-primary");
  },
};
