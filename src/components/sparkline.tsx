import { cn } from "@/lib/utils";

/**
 * A small trend line without axes, for stat tiles and table cells. Plain SVG with no chart
 * library, so it can sit on a page that loads before (or without) Recharts.
 *
 * The line is in the de-emphasis grey and the latest point is a dot in `color` (default the first
 * chart colour), so the tile's own number stays the loudest thing. `null` leaves a gap.
 */
export function Sparkline({
  data,
  color = "var(--chart-1)",
  area = false,
  label,
  className,
}: {
  data: (number | null)[];
  /** Colour of the latest-point dot (and the area wash). Any CSS colour, e.g. "var(--chart-2)". */
  color?: string;
  /** Faint fill under the line. */
  area?: boolean;
  /** Accessible description, e.g. "Rising over the last 12 months". Without it the sparkline is decorative. */
  label?: string;
  className?: string;
}) {
  const values = data.filter((v): v is number => v !== null && Number.isFinite(v));
  if (values.length < 2) return null;

  const W = 100;
  const H = 32;
  const pad = 3; // room for the end dot and the line's own width
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => (data.length === 1 ? W / 2 : (i / (data.length - 1)) * W);
  const y = (v: number) => pad + (1 - (v - min) / span) * (H - pad * 2);

  // One path, broken into runs at nulls.
  let line = "";
  let fill = "";
  let run: [number, number][] = [];
  const flush = () => {
    if (run.length) {
      line += run.map(([px, py], j) => `${j ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`).join("");
      if (area && run.length > 1)
        fill += `M${run[0]![0].toFixed(2)},${H}` + run.map(([px, py]) => `L${px.toFixed(2)},${py.toFixed(2)}`).join("") + `L${run.at(-1)![0].toFixed(2)},${H}Z`;
    }
    run = [];
  };
  data.forEach((v, i) => (v === null || !Number.isFinite(v) ? flush() : run.push([x(i), y(v)])));
  flush();

  const last = data.findLastIndex((v) => v !== null && Number.isFinite(v));
  const lastX = (x(last) / W) * 100;
  const lastY = (y(data[last]!) / H) * 100;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative inline-block h-8 w-20 shrink-0 text-muted-foreground", className)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full overflow-visible">
        {fill && <path d={fill} fill={color} fillOpacity={0.1} stroke="none" />}
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* An HTML dot rather than an SVG circle, so it stays round however the SVG is stretched. */}
      <span
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
        style={{ left: `${lastX}%`, top: `${lastY}%`, background: color }}
      />
    </span>
  );
}
