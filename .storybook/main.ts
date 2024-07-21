import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

import prettierConfig from "./prettier.config";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-storysource",
      options: {
        rule: {
          include: [path.resolve(__dirname, "../src")], // You can specify directories
        },
        loaderOptions: {
          injectStoryParameters: false,
          prettierConfig,
        },
      },
    },
    "@storybook/addon-mdx-gfm",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
