import * as React from "react"
import { cn } from "cn"

/**
 * A form row: label, control, hint and error. Wire the label to the control with `htmlFor`/`id`;
 * FieldError renders nothing without a message. Set `aria-invalid` on the control when invalid,
 * and `aria-describedby` to the hint/error ids if you give them some.
 *
 *   <Field>
 *     <FieldLabel htmlFor="liters">Liter</FieldLabel>
 *     <Input id="liters" inputMode="decimal" aria-invalid={!!err} />
 *     <FieldDescription>Fra pumpen, med desimaler.</FieldDescription>
 *     <FieldError>{err}</FieldError>
 *   </Field>
 *
 * `orientation="horizontal"` puts a switch or checkbox beside its label.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "vertical" | "horizontal" }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "group/field flex gap-1.5",
        orientation === "vertical" ? "flex-col" : "flex-row items-center justify-between gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "flex items-center gap-2 text-sm leading-snug font-medium select-none group-has-[[aria-invalid=true]]/field:text-destructive group-has-disabled/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-xs text-muted-foreground", className)} {...props} />
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null
  return (
    <p role="alert" data-slot="field-error" className={cn("text-xs font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
}

/** Vertical stack of Fields with the house spacing. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("grid gap-4", className)} {...props} />
}

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup }
