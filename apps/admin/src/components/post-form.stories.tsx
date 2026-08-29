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

export const WithPreview: Story = {
  args: {
    enablePreview: true,
    initialValues: {
      title: "Previewing a New Post",
      description: "Review the article before it is published.",
      content: `## Markdown preview

| Feature | Status |
| --- | --- |
| GFM table | Ready |
| Highlighted code | Ready |

<CodeTabs tabs="npm, pnpm">
<CodeTab title="npm">

\`\`\`bash
npm install
\`\`\`

</CodeTab>
<CodeTab title="pnpm">

\`\`\`bash
pnpm install
\`\`\`

</CodeTab>
</CodeTabs>`,
      thumbnail_url: "",
      tags: "nextjs, markdown",
      published: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("tab", { name: "Preview" }));
    await expect(
      await canvas.findByRole("heading", { name: "Markdown preview" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("tab", { name: "npm" })).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Full page preview" }),
    );
    await expect(
      canvas.getByRole("dialog", { name: "Full page preview" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: "Previewing a New Post" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Close full page preview" }),
    );
    await expect(
      canvas.queryByRole("dialog", { name: "Full page preview" }),
    ).not.toBeInTheDocument();
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
