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

Setup details (ThemeProvider, theme script, palettes, charts): the Introduction page in Storybook.

## Versions

Apps follow the **latest** registry by default, so pushing a change out is one
`shadcn add @slopdock/starter --overwrite` per app (then review the diff). Releases are semver git
tags; each one stays installable, so an app can **pin** or roll back by pointing its registry at a
version:

```json
"registries": { "@slopdock": "https://familien-berge.github.io/design-system/r/v1.0.0/{name}.json" }
```

`head -1 src/theme.css` in an app says which version it has. What changed: [CHANGELOG.md](CHANGELOG.md).

**Releasing**: bump `version` in `package.json`, add a CHANGELOG entry, commit, then
`git tag vX.Y.Z && git push origin vX.Y.Z main`.

## Develop

```sh
pnpm install
pnpm storybook   # http://localhost:6006, registry at /r/{name}.json
```

Every file in `src/` (except `src/stories`) is a registry item; `scripts/build-registry.ts` derives
dependencies from imports. Pushing to `main` deploys to Pages.
