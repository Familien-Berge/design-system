"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // after: a 32px hit area around the 16px box without moving anything.
        "peer group/checkbox relative size-4 shrink-0 rounded-[4px] border border-input transition-shadow outline-none after:absolute after:-inset-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current [&>svg]:size-3.5">
        <CheckIcon className="group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
