// Writes registry.json for `shadcn build`: one item per source file in src/ (theme, primitives,
// helpers, blocks). Dependencies are read from the imports, versions from package.json.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
// Sources are staged into registry/<type>/ (generated) so each item's path says what it is.
const stage = "registry";
rmSync(path.join(root, stage), { recursive: true, force: true });
const staged = (file: string, type: string) => {
  const dir = type.replace("registry:", "");
  const to = `${stage}/${dir}/${path.basename(file)}`;
  mkdirSync(path.join(root, stage, dir), { recursive: true });
  copyFileSync(path.join(root, file), path.join(root, to));
  return to;
};

const pkgVersions: Record<string, string> = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).dependencies;

type Item = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string; target?: string }[];
  docs?: string;
};

const blockInfo: Record<string, string> = {
  "app-shell": "Sidebar + sticky top bar layout (sheet on phones), ThemeToggle, PageHeader, PageContent.",
  status: "StatusDot, StatusPill, StatusIcon and the six status tones.",
  "stat-tile": "StatTile and StatGrid for key numbers.",
  "empty-state": "Placeholder card for an empty list.",
  "data-table": "Sortable table on desktop, labelled cards on phones.",
  "sortable-head": "Table header cell that sorts its column.",
  "sort-select": "Sort picker for card lists on phones.",
};

const dep = (spec: string) => {
  const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]!;
  if (name === "react" || name === "react-dom") return null;
  const version = pkgVersions[name];
  if (!version) throw new Error(`no version for ${name} (add it to package.json dependencies)`);
  return `${name}@${version}`;
};

/** "@/components/ui/button" → "@slopdock/button", "@/lib/utils" → "@slopdock/utils", … */
const localItem = (spec: string) => `@slopdock/${spec.split("/").at(-1)}`;

function item(file: string, type: string, name = path.basename(file).replace(/\.tsx?$/, "")): Item {
  const src = readFileSync(path.join(root, file), "utf8");
  const specs = [...src.matchAll(/(?:from|import)\s+["']([^"']+)["']/g)].map((m) => m[1]!);
  const dependencies = [...new Set(specs.filter((s) => !s.startsWith("@/") && !s.startsWith(".")).map(dep))].filter(
    (d): d is string => !!d,
  );
  const registryDependencies = [...new Set(specs.filter((s) => s.startsWith("@/")).map(localItem))];
  return {
    name,
    type,
    ...(blockInfo[name] && { description: blockInfo[name] }),
    ...(dependencies.length && { dependencies }),
    ...(registryDependencies.length && { registryDependencies }),
    files: [{ path: staged(file, type), type }],
  };
}

const tsx = (dir: string) =>
  readdirSync(path.join(root, dir))
    .filter((f) => /\.tsx?$/.test(f))
    .sort()
    .map((f) => `${dir}/${f}`);

const items: Item[] = [
  {
    name: "theme",
    type: "registry:file",
    title: "slopdock theme",
    description: "Neutral OKLCH tokens (light + dark), Geist, base layer, and a --brand accent hook.",
    dependencies: ["tw-animate-css", "shadcn", "@fontsource-variable/geist"].map((d) => dep(d)!),
    files: [{ path: staged("src/theme.css", "registry:file"), type: "registry:file", target: "src/theme.css" }],
    docs: 'Make src/index.css: @import "tailwindcss"; @import "./theme.css"; then optionally override --brand / --brand-foreground in :root (and .dark).',
  },
  item("src/lib/utils.ts", "registry:lib"),
  item("src/lib/sort.ts", "registry:lib"),
  item("src/hooks/use-mobile.ts", "registry:hook"),
  ...tsx("src/components/ui").map((f) => item(f, "registry:ui")),
  ...tsx("src/components").map((f) => item(f, "registry:component")),
];

items.push({
  name: "starter",
  type: "registry:item",
  title: "Everything",
  description: "Theme, all primitives and all blocks: what an app needs to look like slopdock.",
  registryDependencies: items.map((i) => `@slopdock/${i.name}`),
  files: [],
});

writeFileSync(
  path.join(root, "registry.json"),
  JSON.stringify(
    { $schema: "https://ui.shadcn.com/schema/registry.json", name: "slopdock", homepage: "https://familien-berge.github.io/design-system/", items },
    null,
    2,
  ) + "\n",
);
console.log(`registry.json: ${items.length} items`);
