import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Status colours. These are the only hues outside the neutral theme: green ok, blue in progress,
 * violet waiting on a person, amber needs attention, red broken, gray unknown/inactive.
 */
export type Tone = "green" | "blue" | "violet" | "amber" | "red" | "gray";

export const toneClass: Record<Tone, string> = {
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  blue: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  red: "bg-red-500/10 text-red-700 dark:text-red-400",
  gray: "bg-muted text-muted-foreground",
};

export const dotClass: Record<Tone, string> = {
  green: "bg-emerald-500",
  blue: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-zinc-400 dark:bg-zinc-600",
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
