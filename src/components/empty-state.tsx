import * as React from "react";
import { CircleAlert, RotateCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLabels } from "@/lib/labels";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Placeholder for a list with nothing in it yet: what's missing, and how to add the first one. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("items-center gap-2 px-6 py-16 text-center", className)}>
      {Icon && (
        <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
      )}
      <p className="font-medium">{title}</p>
      {description && <div className="max-w-sm text-sm text-muted-foreground">{description}</div>}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}

/** Loading failed: what went wrong, and a retry button when `onRetry` is given. */
export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}) {
  const labels = useLabels();
  return (
    <Card role="alert" className={cn("items-center gap-2 px-6 py-12 text-center", className)}>
      <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-tone-red/10 text-tone-red">
        <CircleAlert className="size-5" />
      </div>
      <p className="font-medium">{title ?? labels.error}</p>
      {description && <div className="max-w-sm text-sm text-muted-foreground">{description}</div>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          <RotateCw /> {labels.retry}
        </Button>
      )}
    </Card>
  );
}
