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

/**
 * A labelled control in one go, wiring the label for you. The child gets the id; for a control
 * made of parts, pass a function and put the id where it belongs. `horizontal` is for a checkbox
 * or switch, with the label after it.
 *
 *   <FormField label="Liter" hint="Fra pumpen."><Input value={v} onChange={...} /></FormField>
 *   <FormField label="Full tank" orientation="horizontal"><Checkbox /></FormField>
 *   <FormField label="Drivstoff">{(id) => <Select ...><SelectTrigger id={id}>...</Select>}</FormField>
 */
function FormField({
  label,
  hint,
  error,
  orientation = "vertical",
  className,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  orientation?: "vertical" | "horizontal"
  className?: string
  children: React.ReactElement<{ id?: string }> | ((id: string) => React.ReactNode)
}) {
  const id = React.useId()
  const control = typeof children === "function" ? children(id) : React.cloneElement(children, { id })
  const name = <FieldLabel htmlFor={id}>{label}</FieldLabel>
  if (orientation === "horizontal") {
    return (
      <Field orientation="horizontal" className={cn("justify-start gap-2", className)}>
        {control}
        {name}
      </Field>
    )
  }
  return (
    <Field className={cn("min-w-0", className)}>
      {name}
      {control}
      {hint && <FieldDescription>{hint}</FieldDescription>}
      <FieldError>{error}</FieldError>
    </Field>
  )
}

/** Vertical stack of Fields with the house spacing. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("grid gap-4", className)} {...props} />
}

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FormField }
