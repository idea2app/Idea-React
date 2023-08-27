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
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  babel: ({ plugins, ...config }) => {
    plugins ||= [];

    const PluginTypescript = [
      "@babel/plugin-transform-typescript",
      { allowDeclareFields: true },
    ] as const;

    for (const [index, plugin] of plugins.entries())
      if (plugin instanceof Array && plugin[0] === PluginTypescript[0]) {
        const [name, option] = plugin;

        plugins[index] = [name, { ...option, ...PluginTypescript[1] }];

        return { ...config, plugins };
      } else if (plugin === PluginTypescript[0]) {
        plugins[index] = PluginTypescript;

        return { ...config, plugins };
      }

    return { ...config, plugins: [PluginTypescript, ...plugins] };
  },
};

export default config;
