"use client"

import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"

/** How far a task has got (an upload, a sync). For a reading against a limit, use Meter. */
function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 rounded-full bg-primary transition-transform"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

/**
 * A value against a range: a budget used, a limit approached. The fill is the tone the caller
 * picks for the reading (`"green"` under, `"amber"` near, `"red"` over); the track is a faint
 * wash of the same tone, so the state reads across the whole bar. Give it a `label` (its
 * accessible name), and show the number as text beside it: colour is never the only cue.
 */
function Meter({
  value,
  max = 100,
  tone = "neutral",
  label,
  className,
}: {
  value: number
  max?: number
  tone?: "neutral" | "green" | "blue" | "amber" | "red"
  label: string
  className?: string
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const color = tone === "neutral" ? "var(--primary)" : `var(--tone-${tone})`
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      data-slot="meter"
      className={cn("relative h-2 w-full overflow-hidden rounded-full", className)}
      style={{ background: `color-mix(in oklab, ${color} 15%, transparent)` }}
    >
      <div className="h-full rounded-full transition-[width]" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export { Progress, Meter }
