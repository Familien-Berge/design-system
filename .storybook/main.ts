import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  // The built registry (public/r/*.json) is served next to the stories, so this site is also
  // what `shadcn add @slopdock/…` installs from.
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tailwindcss()],
    // "@/…" as in an app that installed the registry.
    resolve: { ...config.resolve, alias: { "@": path.resolve(import.meta.dirname, "../src") }, dedupe: ["react", "react-dom"] },
    server: { ...config.server, allowedHosts: true },
  }),
};
export default config;
