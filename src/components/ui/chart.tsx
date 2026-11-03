// Recharts, themed. API-compatible with shadcn/ui's chart (ChartContainer, ChartConfig,
// ChartTooltipContent, ChartLegendContent), so shadcn's docs and examples apply. slopdock additions:
// grid/axis/cursor colours from the theme's chart tokens, `valueFormatter` on the tooltip, and
// tabular figures for values. Conventions (mark sizes, presets, ChartCard) live in charts.tsx.
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "cn";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

/**
 * One entry per series, keyed by the series' dataKey (or nameKey). Its colour becomes
 * `var(--color-<key>)` inside the chart: `<Bar dataKey="fuel" fill="var(--color-fuel)" />`.
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

/**
 * Sizes the chart with CSS, not a pixel prop: `className="h-60 md:h-72"` (it's aspect-video
 * otherwise). Puts the config's colours in scope as --color-<key>.
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  initialDimension?: { width: number; height: number };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${(id || uniqueId).replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          // Recharts' default greys → theme tokens. Text never wears the series colour.
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-chart-grid [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-chart-grid",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-cartesian-axis-line]:stroke-border",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/60",
          "[&_.recharts-dot[stroke='#fff']]:stroke-card [&_.recharts-sector[stroke='#fff']]:stroke-card",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, c]) => {
    const color = c.theme?.[theme as keyof typeof c.theme] || c.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

/** One row of a Recharts tooltip payload (structural, so it works across Recharts versions). */
type TooltipItem = {
  dataKey?: unknown;
  name?: unknown;
  value?: unknown;
  color?: string;
  fill?: string;
  payload?: unknown;
  type?: string;
};

type ValueFormatter = (value: number | string, name: string) => React.ReactNode;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  valueFormatter,
  color,
  nameKey,
  labelKey,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipItem>;
  label?: React.ReactNode;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (label: React.ReactNode, payload: ReadonlyArray<TooltipItem>) => React.ReactNode;
  labelClassName?: string;
  /** Replaces a whole row. Prefer `valueFormatter` when only the number needs formatting. */
  formatter?: (value: unknown, name: unknown, item: TooltipItem, index: number, payload: unknown) => React.ReactNode;
  /** Formats the value, e.g. `(v) => formatCurrency(Number(v))`. */
  valueFormatter?: ValueFormatter;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label;
    if (labelFormatter) return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value ?? label, payload)}</div>;
    if (!value && value !== 0) return label || label === 0 ? <div className={cn("font-medium", labelClassName)}>{label}</div> : null;
    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div className={cn("grid min-w-32 items-start gap-1.5 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-xl ring-1 ring-foreground/10", className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {inConfigOrder(config, payload, (item) => `${nameKey || item.name || item.dataKey || "value"}`)
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || (item.payload as { fill?: string } | undefined)?.fill || item.color;
            const value = item.value as number | string | undefined;
            return (
              <div
                key={`${item.dataKey ?? index}`}
                className={cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center")}
              >
                {formatter && value !== undefined && item.name ? (
                  formatter(value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
                            "size-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={{ "--color-bg": indicatorColor, "--color-border": indicatorColor } as React.CSSProperties}
                        />
                      )
                    )}
                    <div className={cn("flex flex-1 justify-between gap-4 leading-none", nestLabel ? "items-end" : "items-center")}>
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label ?? String(item.name ?? "")}</span>
                      </div>
                      {value !== undefined && value !== null && (
                        <span className="font-medium text-foreground tabular-nums">
                          {valueFormatter
                            ? valueFormatter(value, String(item.name ?? key))
                            : typeof value === "number"
                              ? value.toLocaleString()
                              : String(value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

type LegendItem = { value?: unknown; dataKey?: unknown; color?: string; type?: string; inactive?: boolean };

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  payload?: ReadonlyArray<LegendItem>;
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-1", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {inConfigOrder(config, payload, (item) => `${nameKey || item.dataKey || "value"}`)
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div key={key} className={cn("flex items-center gap-1.5 text-muted-foreground [&>svg]:size-3 [&>svg]:text-muted-foreground", item.inactive && "opacity-50")}>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
              )}
              {itemConfig?.label ?? String(item.value ?? "")}
            </div>
          );
        })}
    </div>
  );
}

/**
 * Legend and tooltip rows in the config's order (the series' fixed order), not Recharts' default
 * alphabetical one. Keys not in the config keep their place after the known ones.
 */
function inConfigOrder<T>(config: ChartConfig, items: ReadonlyArray<T>, keyOf: (item: T) => string): T[] {
  const order = Object.keys(config);
  const rank = (item: T) => {
    const i = order.indexOf(keyOf(item));
    return i === -1 ? order.length : i;
  };
  return items.map((item, i) => ({ item, i })).sort((a, b) => rank(a.item) - rank(b.item) || a.i - b.i).map((x) => x.item);
}

/** The config entry for a payload item, by `key` on the item, then on its row, then `key` itself. */
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const row =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? (payload.payload as Record<string, unknown>) : undefined;
  let configLabelKey: string = key;
  if (key in payload && typeof (payload as Record<string, unknown>)[key] === "string") {
    configLabelKey = (payload as Record<string, string>)[key]!;
  } else if (row && key in row && typeof row[key] === "string") {
    configLabelKey = row[key] as string;
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, useChart };
