import * as React from "react";
import type { LucideIcon } from "lucide-react";
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
