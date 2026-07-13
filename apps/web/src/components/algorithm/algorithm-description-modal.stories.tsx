import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { AlgorithmDescriptionModal } from "./algorithm-description-modal";

const meta = {
  title: "Web/AlgorithmDescriptionModal",
  component: AlgorithmDescriptionModal,
  parameters: { layout: "fullscreen" },
  args: {
    title: "PROBLEM INFO",
    children: <p>문제 설명 본문입니다.</p>,
  },
} satisfies Meta<typeof AlgorithmDescriptionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpensAndCloses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 처음에는 닫혀 있다.
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();

    // 플로팅 버튼 클릭 → 팝업 열림, 버튼 라벨이 CLOSE로 바뀐다.
    await userEvent.click(canvas.getByRole("button", { name: /INFO/i }));
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
    await expect(canvas.getByText("문제 설명 본문입니다.")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: /CLOSE/i }),
    ).toBeInTheDocument();

    // ESC로 닫힌다.
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  },
};

export const ClosesWithButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /INFO/i }));
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "닫기" }));
    await waitFor(() =>
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  },
};
