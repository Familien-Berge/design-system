import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * One key number: label, value, and an optional line under it. `delta` shows a change with an
 * arrow; whether up is good is the caller's call (`good`), since a rising cost isn't.
 */
export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  delta,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon;
  delta?: { value: React.ReactNode; direction: "up" | "down"; good: boolean };
  className?: string;
}) {
  const Arrow = delta?.direction === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <Card className={cn("gap-1 px-4 py-3", className)}>
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        <span className="truncate">{label}</span>
        {Icon && <Icon className="size-3.5 shrink-0" />}
      </div>
      <div className="text-xl font-semibold tracking-tight tabular-nums">{value}</div>
      {(sub || delta) && (
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center font-medium tabular-nums",
                delta.good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
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
