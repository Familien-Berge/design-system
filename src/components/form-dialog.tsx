import * as React from "react";
import { XIcon } from "lucide-react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

// A bottom sheet on phones, a centred dialog from `sm` up. Only the body scrolls, so the title
// and the footer's buttons stay on screen however tall the form gets.
const sheetClass = cn(
  "flex max-h-[90dvh] flex-col gap-0 p-0 sm:max-h-[calc(100dvh-8rem)]",
  "max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none",
);
const footerClass =
  "flex shrink-0 flex-wrap justify-end gap-2 border-t px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5";

/**
 * Dialog for a form, a detail view or a wide table. Put the form's buttons in `footer`; to submit
 * with Enter, render a <form id="x"> as the body and give the save button `form="x" type="submit"`.
 */
export function FormDialog({
  open,
  onClose,
  title,
  description,
  footer,
  wide = false,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** A line under the title; also the dialog's accessible description. */
  description?: React.ReactNode;
  footer?: React.ReactNode;
  /** max-w-2xl instead of max-w-lg, for charts, tables and ladder editors. */
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const labels = useLabels();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(sheetClass, wide ? "sm:max-w-2xl" : "sm:max-w-lg", className)}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b py-2 pr-2 pl-5 sm:py-1.5">
          <div className="grid min-w-0 gap-1 py-1.5">
            <DialogTitle className="text-sm leading-snug font-semibold">{title}</DialogTitle>
            {description && <DialogDescription className="text-xs">{description}</DialogDescription>}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label={labels.close} className="size-11 shrink-0 sm:size-8">
              <XIcon />
            </Button>
          </DialogClose>
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm text-foreground",
            !footer && "pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4",
          )}
        >
          {children}
        </div>
        {footer && <div className={footerClass}>{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}

/**
 * "Are you sure?" before something that can't be undone. An alert dialog: focus starts on Cancel,
 * and clicking outside doesn't dismiss it. `destructive` (the default) paints the confirm button
 * red. Keep it open while `busy` and close it from the caller once the action has finished.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel,
  cancelLabel,
  destructive = true,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  /** What will happen, e.g. which item is deleted. */
  children?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  destructive?: boolean;
  busy?: boolean;
}) {
  const labels = useLabels();
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialogPrimitive.Content
          {...(children ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            sheetClass,
          )}
        >
          <div className="grid gap-2 px-5 pt-5 pb-4">
            <AlertDialogPrimitive.Title className="text-base leading-snug font-semibold">{title}</AlertDialogPrimitive.Title>
            {children && (
              <AlertDialogPrimitive.Description asChild>
                <div className="text-muted-foreground">{children}</div>
              </AlertDialogPrimitive.Description>
            )}
          </div>
          <div className={footerClass}>
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline" disabled={busy}>
                {cancelLabel ?? labels.cancel}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <Button
              className={cn(destructive && "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/80")}
              disabled={busy}
              onClick={onConfirm}
            >
              {confirmLabel ?? (destructive ? labels.delete : labels.confirm)}
            </Button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
