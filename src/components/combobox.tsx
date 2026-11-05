import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  /** Shown above the value, which stays visible beneath it. */
  label?: string;
}

/**
 * A text field that suggests values as you type. What's typed is the value, so anything goes:
 * the options only help. Use Select when the value must be one of them. Enter takes the
 * highlighted suggestion, and otherwise submits the form as usual.
 */
export function Combobox({
  value,
  onChange,
  options,
  maxOptions = 20,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  maxOptions?: number;
}) {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);

  const matches = React.useMemo(() => {
    const needle = value.trim().toLowerCase();
    const hits = needle
      ? options.filter((o) => o.value.toLowerCase().includes(needle) || o.label?.toLowerCase().includes(needle))
      : options;
    return hits.slice(0, maxOptions);
  }, [options, value, maxOptions]);
  const showing = open && matches.length > 0;
  const highlighted = matches[active];

  function choose(option: ComboboxOption) {
    onChange(option.value);
    setOpen(false);
    setActive(-1);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (matches.length > 0) {
        const step = e.key === "ArrowDown" ? 1 : -1;
        setActive((i) => (i + step + matches.length) % matches.length);
      }
    } else if (e.key === "Enter" && showing && highlighted) {
      e.preventDefault();
      choose(highlighted);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      <Input
        {...props}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showing}
        aria-controls={listId}
        aria-activedescendant={showing && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={(e) => {
          onFocus?.(e);
          setOpen(true);
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setOpen(false);
          setActive(-1);
        }}
        onKeyDown={handleKey}
      />
      {showing && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-popover p-1 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10"
        >
          {matches.map((option, i) => (
            <li
              key={option.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={cn(
                "cursor-default rounded-md px-2 py-1.5 hover:bg-accent hover:text-accent-foreground",
                i === active && "bg-accent text-accent-foreground",
              )}
              // Keeps focus in the input, so its blur doesn't close the list before the click lands.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(option)}
            >
              {option.label && <span className="block truncate">{option.label}</span>}
              <span className={cn("block truncate", option.label && "text-xs text-muted-foreground")}>
                {option.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
