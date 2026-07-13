import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        // 스토리가 처음 임포트하는 의존성 때문에 Vite가 테스트 도중 리로드되어
        // 테스트가 깨지는 것을 방지한다 (vitest 경고 권장 사항).
        optimizeDeps: {
          include: ["clsx", "next-themes", "react-intersection-observer"],
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
