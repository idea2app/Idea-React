import path from "path";

import prettierConfig from "./prettier.config";

const config = {
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
  ],
  framework: {
    name: "storybook-react-parcel",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
