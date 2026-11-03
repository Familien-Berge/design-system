# Changelog

Releases are git tags `vX.Y.Z` (the version in `package.json`). Every tag stays installable at
`https://familien-berge.github.io/design-system/r/vX.Y.Z/{name}.json`; `/r/{name}.json` is always
the latest. An app's `src/theme.css` starts with the version it was installed from.

- **major**: a token renamed/removed or a component API that breaks callers.
- **minor**: new items, props or tokens.
- **patch**: fixes and visual tweaks within the same API.

## 1.0.0 — 2026-11-03

First versioned release.

- **Charts**: `ui/chart` (Recharts 3, shadcn's chart API), `charts` (`ChartCard` with chart/table
  switch, `ChartTable`, `seriesConfig`, `chartDefaults`), `sparkline`, `StatTile` `trend`.
- **Tokens**: `--chart-1…8` (validated categorical palette, light + dark) replace the unused greys;
  `--tone-green/blue/violet/amber/red/gray` (+ `success`/`info`/`warning`) replace raw Tailwind hues
  in `status` and `stat-tile`. Contrast: `--ring`, `--input`, light `--destructive` and
  `--muted-foreground`, `--sidebar-ring` now meet WCAG; dark `--sidebar-primary` neutral;
  `color-scheme` per theme.
- **New**: `form-dialog` (`FormDialog`, `ConfirmDialog`), `field`, `checkbox`, `radio-group`,
  `progress` (`Progress`, `Meter`), `ErrorState`, `lib/format`, `lib/labels` (`LabelsProvider`,
  `en`, `nb`).
- **DataTable**: `loading`, `error`, `onRetry`; clickable rows/cards are `role="button"`; `empty`
  defaults to the labels.
- **A11y**: labelled `StatusDot`s are focusable; `SidebarTrigger` takes `label`; `ThemeToggle`,
  `SortSelect` and `ChartCard` read their words from `LabelsProvider`.
- Breaking for apps that styled with the old values: `toneClass` / `dotClass` now use
  `--tone-*` tokens (same API); `--chart-*` are colours, not greys.
