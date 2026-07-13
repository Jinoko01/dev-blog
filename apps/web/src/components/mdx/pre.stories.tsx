import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Pre } from "./pre";

const meta = {
  title: "Web/Mdx/Pre",
  component: Pre,
} satisfies Meta<typeof Pre>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CopiesCodeToClipboard: Story = {
  args: {
    children: <code>const answer = 42;</code>,
    className: "bg-[#0d1117] text-white p-4",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 헤드리스 환경의 클립보드 권한 문제를 피하기 위해 스텁으로 대체한다.
    const writeText = fn(async () => {});
    Object.defineProperty(window.navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    await expect(canvas.getByText("const answer = 42;")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Copy code" }));

    await expect(writeText).toHaveBeenCalledWith("const answer = 42;");
  },
};
