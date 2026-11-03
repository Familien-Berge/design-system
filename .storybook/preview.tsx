import { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../src/stories/storybook.css";

/** App accents to try the theme with: the icon colours of the slopdock apps. */
const brands: Record<string, [string, string] | null> = {
  neutral: null,
  ynab: ["#3d5afe", "#ffffff"],
  last: ["#0c8b9a", "#ffffff"],
  ladelaug: ["#4f46e5", "#ffffff"],
  kokebok: ["#c8622a", "#fff7ed"],
};

function SyncGlobals({ theme, brand }: { theme: string; brand: string }) {
  const { setTheme } = useTheme();
  useEffect(() => setTheme(theme), [theme, setTheme]);
  useEffect(() => {
    const s = document.documentElement.style;
    const b = brands[brand];
    if (b) {
      s.setProperty("--brand", b[0]);
      s.setProperty("--brand-foreground", b[1]);
    } else {
      s.removeProperty("--brand");
      s.removeProperty("--brand-foreground");
    }
  }, [brand]);
  return null;
}

const withApp: Decorator = (Story, { globals }) => (
  <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange scriptProps={{ type: "application/json" }}>
    <SyncGlobals theme={globals.theme ?? "dark"} brand={globals.brand ?? "neutral"} />
    <TooltipProvider delayDuration={300}>
      <Story />
      <Toaster position="bottom-right" />
    </TooltipProvider>
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withApp],
  globalTypes: {
    theme: {
      description: "Light or dark",
      toolbar: { title: "Theme", icon: "mirror", items: ["dark", "light"], dynamicTitle: true },
    },
    brand: {
      description: "App accent (--brand)",
      toolbar: { title: "Brand", icon: "paintbrush", items: Object.keys(brands), dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "dark", brand: "neutral" },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i } },
    options: { storySort: { order: ["Introduction", "Foundations", "Blocks", "Examples", "Primitives"] } },
  },
};
export default preview;
