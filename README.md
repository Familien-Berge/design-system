# slopdock design system

The look of slopdock, shared with the other apps it hosts: shadcn/ui (radix-nova), a neutral OKLCH
theme with a per-app `--brand` accent, Geist, and a few blocks (app shell, status, stat tiles, empty
state, data table).

**Storybook + registry:** https://familien-berge.github.io/design-system/

Components are copied into each app with the shadcn CLI, not installed as a package. In the app's
`components.json`:

```json
"registries": { "@slopdock": "https://familien-berge.github.io/design-system/r/{name}.json" }
```

```sh
pnpm dlx shadcn add @slopdock/starter              # theme + all primitives + all blocks
pnpm dlx shadcn add @slopdock/data-table --overwrite  # update one item
```

Setup details (ThemeProvider, theme script, palettes): the Introduction page in Storybook.

## Develop

```sh
pnpm install
pnpm storybook   # http://localhost:6006, registry at /r/{name}.json
```

Every file in `src/` (except `src/stories`) is a registry item; `scripts/build-registry.ts` derives
dependencies from imports. Pushing to `main` deploys to Pages.
