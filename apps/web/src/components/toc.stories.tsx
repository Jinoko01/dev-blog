import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { TableOfContents } from "./toc";

const meta = {
  title: "Web/TableOfContents",
  component: TableOfContents,
  // TOC는 .prose 내부의 헤딩을 DOM에서 직접 수집하므로 본문을 함께 렌더링한다.
  decorators: [
    (Story) => (
      <div className="flex gap-8 p-8">
        <div className="prose">
          <h2 id="intro">Intro</h2>
          <p>Introduction paragraph.</p>
          <h3 id="details">Details</h3>
          <p>Details paragraph.</p>
          <h2 id="conclusion">Conclusion</h2>
          <p>Conclusion paragraph.</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 본문 헤딩들이 목차 링크로 수집된다.
    const intro = await canvas.findByRole("link", { name: "Intro" });
    await expect(intro).toHaveAttribute("href", "#intro");
    await expect(
      canvas.getByRole("link", { name: "Details" }),
    ).toBeInTheDocument();

    // 링크 클릭 시 해당 헤딩으로 해시가 변경된다.
    await userEvent.click(canvas.getByRole("link", { name: "Conclusion" }));
    await waitFor(() => expect(window.location.hash).toBe("#conclusion"));
  },
};
