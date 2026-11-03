import * as React from "react";
import { ChartColumn, Table2 } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

/*
 * How slopdock charts look, on top of ui/chart (Recharts). This file has no Recharts import, so
 * ChartCard and the presets don't pull the chart library into a page by themselves: keep the
 * chart itself in a lazy-loaded component.
 *
 *   const config = seriesConfig({ fuel: "Drivstoff", service: "Verksted" });
 *   <ChartCard title="Kostnader" table={<ChartTable data={rows} config={config} x={{ key: "month", label: "Måned" }} />}>
 *     <ChartContainer config={config} className="aspect-auto h-64">
 *       <BarChart data={rows} margin={chartDefaults.margin}>
 *         <CartesianGrid {...chartDefaults.grid} />
 *         <XAxis dataKey="month" {...chartDefaults.xAxis} />
 *         <YAxis {...chartDefaults.yAxis} tickFormatter={(v) => formatCompact(v)} />
 *         <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => formatCurrency(Number(v))} />} />
 *         <ChartLegend content={<ChartLegendContent />} />
 *         <Bar dataKey="fuel" stackId="a" fill="var(--color-fuel)" {...chartDefaults.segment} />
 *         <Bar dataKey="service" stackId="a" fill="var(--color-service)" {...chartDefaults.segmentTop} />
 *       </BarChart>
 *     </ChartContainer>
 *   </ChartCard>
 *
 * Rules the presets can't enforce:
 * - One y-axis. Two measures of different scale are two charts.
 * - A legend for two or more series, none for one (the title names it).
 * - Status tones (--tone-*) are not series colours, and series colours are not text colours.
 */

/** Recharts props for the house look: thin marks, recessive grid and axes. Spread them in. */
export const chartDefaults = {
  margin: { top: 8, right: 8, bottom: 0, left: 0 },
  /** Horizontal hairlines only. */
  grid: { vertical: false },
  xAxis: { tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 16 },
  /** `width: "auto"` sizes the axis to its longest tick label. */
  yAxis: { tickLine: false, axisLine: false, tickMargin: 4, width: "auto" as const },
  /** A single bar series: at most 24px thick, 4px rounded data end, square at the baseline. */
  bar: { radius: [4, 4, 0, 0] as [number, number, number, number], maxBarSize: 24 },
  /** A stacked segment below the top one: square, with a 2px surface-coloured gap. */
  segment: { maxBarSize: 24, stroke: "var(--card)", strokeWidth: 2 },
  /** The top segment of a stack. */
  segmentTop: { maxBarSize: 24, stroke: "var(--card)", strokeWidth: 2, radius: [4, 4, 0, 0] as [number, number, number, number] },
  /** 2px line, no dots until hovered. */
  line: { type: "monotone" as const, strokeWidth: 2, dot: false, activeDot: { r: 4, strokeWidth: 2, stroke: "var(--card)" } },
  /** A line with a 10% wash under it. */
  area: { type: "monotone" as const, strokeWidth: 2, fillOpacity: 0.1, dot: false, activeDot: { r: 4, strokeWidth: 2, stroke: "var(--card)" } },
};

type SeriesEntry = React.ReactNode | { label: React.ReactNode; color: string };

/**
 * A ChartConfig with the theme's series colours handed out in key order: the first key gets
 * --chart-1, the second --chart-2, and so on. List every series the chart can ever show, in a
 * fixed order, and build it once (module scope): colour follows the series, so hiding one must not
 * repaint the others. An entry can set its own colour, e.g. a grey "Other":
 * `{ other: { label: "Annet", color: "var(--muted-foreground)" } }`. More than 8 series: fold the
 * smallest into "Other".
 */
export function seriesConfig<K extends string>(series: Record<K, SeriesEntry>): ChartConfig & Record<K, ChartConfig[string]> {
  const entries = Object.entries(series) as [K, SeriesEntry][];
  if (entries.length > 8)
    console.warn(`seriesConfig: ${entries.length} series; the palette has 8. Fold the rest into "Other".`);
  let slot = 0;
  return Object.fromEntries(
    entries.map(([key, entry]) => {
      if (entry && typeof entry === "object" && !React.isValidElement(entry) && "color" in entry)
        return [key, { label: entry.label, color: entry.color }];
      slot += 1;
      return [key, { label: entry as React.ReactNode, color: `var(--chart-${((slot - 1) % 8) + 1})` }];
    }),
  ) as ChartConfig & Record<K, ChartConfig[string]>;
}

/**
 * Card around one chart: title, optional description and actions, and, with `table`, a switch
 * between the chart and the same numbers as a table. The table is the accessible version (screen
 * readers, colour-blind readers, exact values), so give every chart one.
 */
export function ChartCard({
  title,
  description,
  action,
  table,
  labels: labelsProp,
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right side of the header, e.g. a period picker. */
  action?: React.ReactNode;
  /** The chart's data as a table, usually a ChartTable. Adds the chart/table switch. */
  table?: React.ReactNode;
  /** Accessible names of the two views; default from LabelsProvider. */
  labels?: { chart: string; table: string };
  className?: string;
  children: React.ReactNode;
}) {
  const [view, setView] = React.useState<"chart" | "table">("chart");
  const ctx = useLabels();
  const labels = labelsProp ?? { chart: ctx.chart, table: ctx.table };
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {(action || table) && (
          <CardAction className="flex items-center gap-2">
            {action}
            {table && (
              <ToggleGroup type="single" size="sm" spacing={0} value={view} onValueChange={(v) => v && setView(v as "chart" | "table")}>
                <ToggleGroupItem value="chart" aria-label={labels.chart} title={labels.chart}>
                  <ChartColumn />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label={labels.table} title={labels.table}>
                  <Table2 />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{view === "table" && table ? table : children}</CardContent>
    </Card>
  );
}

/**
 * A chart's data as a table: one row per x value, one column per series in the config. Numbers
 * are right-aligned with tabular figures.
 */
export function ChartTable<T extends object>({
  data,
  config,
  x,
  format = (v) => (typeof v === "number" ? v.toLocaleString() : String(v ?? "–")),
  className,
}: {
  data: T[];
  config: ChartConfig;
  /** The category / time column: its key in each row, its header, and how to show it. */
  x: { key: keyof T & string; label: React.ReactNode; format?: (v: T[keyof T]) => React.ReactNode };
  /** Formats each series value. */
  format?: (value: unknown, key: string) => React.ReactNode;
  className?: string;
}) {
  const series = Object.keys(config);
  return (
    <div className={cn("max-h-72 overflow-auto rounded-lg ring-1 ring-foreground/10", className)}>
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-3 text-muted-foreground">{x.label}</TableHead>
            {series.map((key) => (
              <TableHead key={key} className="pr-3 text-right text-muted-foreground">
                {config[key]?.label ?? key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="pl-3">{x.format ? x.format(row[x.key]) : String(row[x.key])}</TableCell>
              {series.map((key) => (
                <TableCell key={key} className="pr-3 text-right tabular-nums">
                  {format((row as Record<string, unknown>)[key], key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
