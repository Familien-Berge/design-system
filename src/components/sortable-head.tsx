import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { SortState } from "@/lib/sort";
import { cn } from "@/lib/utils";

/** Table header cell that sorts its column; see useSort. */
export function SortableHead<K extends string>({
  column,
  sort,
  onSort,
  className,
  children,
}: {
  column: K;
  sort: SortState<K> | null;
  onSort: (column: K) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const active = sort?.key === column;
  const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={className} aria-sort={!active ? "none" : sort.dir === "asc" ? "ascending" : "descending"}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "group/sort -mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
          className?.includes("text-right") && "flex-row-reverse",
        )}
      >
        {children}
        {/* Unsorted columns only show the hint on hover, so headers don't get wider. */}
        <Icon className={cn("size-3.5", !active && "hidden opacity-50 group-hover/sort:inline-block")} />
      </button>
    </TableHead>
  );
}
