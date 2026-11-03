import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Status colours. These are the only hues outside the neutral theme: green ok, blue in progress,
 * violet waiting on a person, amber needs attention, red broken, gray unknown/inactive. Each is a
 * theme token (--tone-*), so apps, sidebar badges and charts' status marks all share one value.
 * Never use a tone as a chart series colour; series use --chart-1…8.
 */
export type Tone = "green" | "blue" | "violet" | "amber" | "red" | "gray";

/** Tinted background + text in the tone: pills, badges, round icons. */
export const toneClass: Record<Tone, string> = {
  green: "bg-tone-green/10 text-tone-green",
  blue: "bg-tone-blue/10 text-tone-blue",
  violet: "bg-tone-violet/10 text-tone-violet",
  amber: "bg-tone-amber/10 text-tone-amber",
  red: "bg-tone-red/10 text-tone-red",
  gray: "bg-muted text-muted-foreground",
};

/** Solid fill in the tone: dots and other small marks. */
export const dotClass: Record<Tone, string> = {
  green: "bg-tone-green",
  blue: "bg-tone-blue",
  violet: "bg-tone-violet",
  amber: "bg-tone-amber",
  red: "bg-tone-red",
  gray: "bg-tone-gray",
};

/** Small coloured dot. `pulse` for in-progress, `ping` for something that is down right now. */
export function StatusDot({
  tone,
  label,
  pulse,
  ping,
  className,
}: {
  tone: Tone;
  /** Tooltip and accessible name. */
  label?: string;
  pulse?: boolean;
  ping?: boolean;
  className?: string;
}) {
  const dot = (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("relative inline-flex size-2.5 shrink-0 rounded-full", dotClass[tone], pulse && "animate-pulse", className)}
    >
      {ping && <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", dotClass[tone])} />}
    </span>
  );
  if (!label) return dot;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{dot}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Compact tinted label, optionally with a leading icon: `<StatusPill tone="green"><CircleCheck />Synced</StatusPill>`. */
export function StatusPill({ tone = "gray", className, ...props }: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Round tinted icon, for timelines and activity rows. */
export function StatusIcon({ tone, className, ...props }: React.ComponentProps<"span"> & { tone: Tone }) {
  return (
    <span
      className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5", toneClass[tone], className)}
      {...props}
    />
  );
}
