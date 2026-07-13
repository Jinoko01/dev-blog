import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  title: "Web/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  // 이전 실행에서 저장된 테마가 결과에 영향을 주지 않도록 초기화한다.
  beforeEach: () => {
    window.localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    return () => {
      window.localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");
    };
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TogglesTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // mounted 이후에만 버튼이 렌더링된다.
    const button = await canvas.findByRole("button", { name: "Toggle theme" });

    await userEvent.click(button);
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    await userEvent.click(button);
    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass("dark"),
    );
  },
};
