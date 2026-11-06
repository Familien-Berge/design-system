import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label?: string;
}

function Row({
  checked,
  implied,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  /** Ticked because the All row is, not on its own: drawn muted. */
  implied?: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 select-none hover:bg-accent hover:text-accent-foreground">
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        className={cn(implied && "data-checked:border-muted-foreground/50 data-checked:bg-muted-foreground/50 dark:data-checked:bg-muted-foreground/50")}
      />
      <span className="min-w-0 truncate">{children}</span>
    </label>
  );
}

/**
 * A dropdown of checkboxes, for filtering on several values. Stays open while you tick. `value`
 * is what's ticked. The top row, `allLabel`, ticks every option, or none when they all are; while
 * it's on the options show muted ticks, and unticking one leaves the rest ticked.
 */
export function MultiSelect({
  value,
  onChange,
  options,
  allLabel,
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTrigger>, "value" | "onChange" | "children"> & {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  allLabel: string;
}) {
  const l = useLabels();
  const ticked = options.filter((o) => value.includes(o.value));
  const all = ticked.length === options.length;
  const first = ticked[0];
  const summary = all
    ? allLabel
    : !first
      ? l.none
      : ticked.length === 1
        ? (first.label ?? first.value)
        : `${ticked.length} ${l.of} ${options.length}`;

  function toggle(option: string, checked: boolean) {
    onChange(options.map((o) => o.value).filter((v) => (v === option ? checked : value.includes(v))));
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50",
          className,
        )}
        {...props}
      >
        <span className="min-w-0 truncate">{summary}</span>
        <ChevronDown className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-(--radix-popover-content-available-height) w-auto min-w-(--radix-popover-trigger-width) gap-0 overflow-y-auto p-1"
      >
        <Row checked={all} onCheckedChange={() => onChange(all ? [] : options.map((o) => o.value))}>
          {allLabel}
        </Row>
        {options.map((option) => (
          <Row
            key={option.value}
            checked={value.includes(option.value)}
            implied={all}
            onCheckedChange={(checked) => toggle(option.value, checked)}
          >
            {option.label ?? option.value}
          </Row>
        ))}
      </PopoverContent>
    </Popover>
  );
}
