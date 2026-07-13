import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Footer } from "./footer";

const meta = {
  title: "Web/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("link", { name: "ARTICLES" }),
    ).toHaveAttribute("href", "/articles");
    await expect(
      canvas.getByRole("link", { name: "GitHub" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:dswvgw1234@gmail.com",
    );
    await expect(
      canvas.getByText(new RegExp(`© ${new Date().getFullYear()}`)),
    ).toBeInTheDocument();
  },
};
