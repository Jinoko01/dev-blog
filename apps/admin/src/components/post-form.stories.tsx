import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { PostForm } from "./post-form";

const meta = {
  title: "Admin/PostForm",
  component: PostForm,
  parameters: { layout: "padded" },
  args: {
    submitLabel: "Create",
    pendingLabel: "Creating...",
    onSubmit: fn(),
  },
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    slug: "nextjs-14-guide",
    submitLabel: "Save",
    pendingLabel: "Saving...",
    initialValues: {
      title: "Next.js 14 App Router Guide",
      description: "A short primer on the App Router.",
      content: "## Hello World",
      thumbnail_url: "",
      tags: "react, nextjs",
      published: true,
    },
  },
};

export const SubmitsFilledValues: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByPlaceholderText("Next.js 14 App Router Guide"),
      "My First Post",
    );
    await userEvent.type(
      canvas.getByPlaceholderText(/Hello World/),
      "## Intro",
    );

    await userEvent.click(canvas.getByRole("button", { name: "Create" }));

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "My First Post",
        content: "## Intro",
      }),
    );
  },
};
