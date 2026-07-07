import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { AlgorithmForm } from "./algorithm-form";

const meta = {
  title: "Admin/AlgorithmForm",
  component: AlgorithmForm,
  parameters: { layout: "padded" },
  args: {
    submitLabel: "Create",
    pendingLabel: "Creating...",
    onSubmit: fn(),
  },
} satisfies Meta<typeof AlgorithmForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SubmitsFilledValues: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByPlaceholderText("Two Sum (LeetCode 1)"),
      "Two Sum",
    );
    await userEvent.type(
      canvas.getByPlaceholderText("e.g., 골드1, D3, LV2"),
      "골드1",
    );
    await userEvent.type(
      canvas.getByPlaceholderText(
        "function twoSum(nums: number[], target: number): number[] { ... }",
      ),
      "return two pointers approach",
    );

    await userEvent.click(canvas.getByRole("button", { name: "Create" }));

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Two Sum",
        difficulty: "골드1",
        code: "return two pointers approach",
      }),
    );
  },
};
