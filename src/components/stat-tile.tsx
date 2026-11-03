import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";

/**
 * One key number: label, value, and an optional line under it. `delta` shows a change with an
 * arrow; whether up is good is the caller's call (`good`), since a rising cost isn't. `trend`
 * adds a sparkline of recent values (e.g. the last 12 months) beside the number.
 */
export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  delta,
  trend,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon;
  delta?: { value: React.ReactNode; direction: "up" | "down"; good: boolean };
  trend?: { data: (number | null)[]; label?: string; color?: string };
  className?: string;
}) {
  const Arrow = delta?.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className={cn("@container gap-1 px-4 py-3", className)}>
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        <span className="truncate">{label}</span>
        {Icon && <Icon className="size-3.5 shrink-0" />}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 truncate text-xl font-semibold tracking-tight tabular-nums">{value}</div>
        {/* Only when the tile has room: the number always wins (two tiles across a phone don't). */}
        {trend && <Sparkline data={trend.data} label={trend.label} color={trend.color} className="hidden h-7 w-20 @min-[14rem]:inline-block" />}
      </div>
      {(sub || delta) && (
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center font-medium tabular-nums",
                delta.good ? "text-tone-green" : "text-tone-red",
              )}
            >
              <Arrow className="size-3.5" />
              {delta.value}
            </span>
          )}
          {sub}
        </div>
      )}
    </Card>
  );
}

/** Responsive row of StatTiles: two across on phones, up to four on wide screens. */
export function StatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)} {...props} />;
}
