import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableHead } from "@/components/sortable-head";
import { SortSelect } from "@/components/sort-select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLabels } from "@/lib/labels";
import { useSort, type SortState, type SortValue } from "@/lib/sort";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  /** Makes the column sortable client-side: header click on desktop, the sort picker on phones. */
  sortValue?: (row: T) => SortValue;
  /** Sortable without a sortValue, for server-side sorting (see DataTableProps.sort). */
  sortable?: boolean;
  /** Direction of the first click. Default "asc"; "desc" suits dates and amounts. */
  sortFirst?: "asc" | "desc";
  /** Applied to the header and every cell, e.g. "text-right" or "hidden @4xl:table-cell". */
  className?: string;

  // ---- phone cards; all optional, ignored on desktop ----

  /** Label beside the value in a card, and in the sort picker. Defaults to `header` when it is a string. */
  cardLabel?: string;
  /**
   * How the column appears in a card.
   * undefined: a labelled "label | value" row (the default)
   * "title":   on the card's top line without a label; several are joined, the first one emphasised
   * "footer":  a full-width strip at the bottom (row actions)
   * "hidden":  left out
   */
  card?: "title" | "footer" | "hidden";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  /** Makes rows (and phone cards) clickable and keyboard-focusable. */
  onRowClick?: (row: T) => void;
  /** Shown when there are no rows. Defaults to the "empty" label; pass an <EmptyState> for more. */
  empty?: React.ReactNode;
  /** Data still on its way (e.g. SWR's first load): skeleton rows instead of the empty message. */
  loading?: boolean;
  /** Loading failed: an error message (and a retry button with `onRetry`) instead of the rows. */
  error?: React.ReactNode | true;
  onRetry?: () => void;
  defaultSort?: SortState<string> | null;
  /**
   * Controlled sorting, e.g. when the server sorts: rows are shown in the order given, and
   * header clicks and the phone picker report the wanted order through onSortChange.
   */
  sort?: SortState<string> | null;
  onSortChange?: (sort: SortState<string> | null) => void;
  /** First entry of the phone sort picker. */
  defaultSortLabel?: string;
  className?: string;
}

const labelOf = <T,>(c: Column<T>) => c.cardLabel ?? (typeof c.header === "string" ? c.header : c.key);
const isSortable = <T,>(c: Column<T>) => !!c.sortValue || !!c.sortable;

/** Click and Enter/Space handlers for a clickable row or card. */
function clickable<T>(row: T, onRowClick?: (row: T) => void) {
  if (!onRowClick) return {};
  return {
    tabIndex: 0,
    role: "button" as const,
    onClick: () => onRowClick(row),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      onRowClick(row);
    },
  };
}

/**
 * A table on desktop and a list of cards on phones. Only one of the two is rendered, so row text
 * isn't duplicated for screen readers and tests. Columns drop out by the table's own width with
 * container queries (`hidden @4xl:table-cell`), since the sidebar takes a share of the viewport.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  loading = false,
  error,
  onRetry,
  defaultSort = null,
  sort: controlledSort,
  onSortChange,
  defaultSortLabel,
  className,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();
  const labels = useLabels();
  const getters = Object.fromEntries(columns.filter((c) => c.sortValue).map((c) => [c.key, c.sortValue!]));
  const local = useSort(rows, getters, defaultSort);
  const controlled = controlledSort !== undefined;
  const sort = controlled ? controlledSort : local.sort;
  const sorted = controlled ? rows : local.rows;
  const setSort = (next: SortState<string> | null) => (controlled ? onSortChange?.(next) : local.setSort(next));
  // First click sorts the column's way, the second reverses it, the third goes back to the default order.
  const firstDir = (key: string) => columns.find((c) => c.key === key)?.sortFirst ?? "asc";
  const toggle = (key: string) => {
    const first = firstDir(key);
    setSort(sort?.key !== key ? { key, dir: first } : sort.dir === first ? { key, dir: first === "asc" ? "desc" : "asc" } : null);
  };

  if (error) return <ErrorState description={error === true ? undefined : error} onRetry={onRetry} className={className} />;
  if (loading && !rows.length)
    return (
      <div role="status" aria-label={labels.loading} className={cn("grid gap-2", className)}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  if (!rows.length)
    return typeof empty === "string" || empty === undefined ? (
      <p className="py-12 text-center text-sm text-muted-foreground">{empty ?? labels.empty}</p>
    ) : (
      <>{empty}</>
    );

  if (isMobile) {
    const labels = Object.fromEntries(columns.filter(isSortable).map((c) => [c.key, labelOf(c)]));
    const title = columns.filter((c) => c.card === "title");
    const body = columns.filter((c) => !c.card);
    const footer = columns.filter((c) => c.card === "footer");
    return (
      <div className={cn("grid gap-3", className)}>
        {Object.keys(labels).length > 0 && (
          <div className="flex justify-end">
            <SortSelect labels={labels} sort={sort} onChange={setSort} defaultLabel={defaultSortLabel} firstDir={firstDir} />
          </div>
        )}
        <ul className="grid gap-3">
          {sorted.map((row) => (
            <li key={rowKey(row)}>
              <Card
                size="sm"
                {...clickable(row, onRowClick)}
                className={cn(
                  onRowClick &&
                    "cursor-pointer transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted/50",
                )}
              >
                {title.length > 0 && (
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-3">
                    {title.map((c, i) => (
                      <div key={c.key} className={cn("min-w-0 break-words", i === 0 ? "font-medium" : "text-muted-foreground")}>
                        {c.render(row)}
                      </div>
                    ))}
                  </div>
                )}
                {body.length > 0 && (
                  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 px-3">
                    {body.map((c) => (
                      <React.Fragment key={c.key}>
                        <dt className="text-muted-foreground">{labelOf(c)}</dt>
                        <dd className="min-w-0 text-right break-words">{c.render(row)}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                )}
                {footer.length > 0 && (
                  // Actions in the footer shouldn't also trigger the card's own click.
                  <div
                    className="flex flex-wrap items-center justify-end gap-2 border-t px-3 pt-3"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {footer.map((c) => (
                      <React.Fragment key={c.key}>{c.render(row)}</React.Fragment>
                    ))}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Card className={cn("@container overflow-hidden p-0", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((c, i) =>
              isSortable(c) ? (
                <SortableHead key={c.key} column={c.key} sort={sort} onSort={toggle} className={cn(i === 0 && "pl-4", c.className)}>
                  {c.header}
                </SortableHead>
              ) : (
                <TableHead key={c.key} className={cn("text-muted-foreground", i === 0 && "pl-4", c.className)}>
                  {c.header}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={rowKey(row)}
              {...clickable(row, onRowClick)}
              className={cn(onRowClick && "cursor-pointer outline-none focus-visible:bg-muted/50")}
            >
              {columns.map((c, i) => (
                <TableCell key={c.key} className={cn(i === 0 && "pl-4", i === columns.length - 1 && "pr-4", c.className)}>
                  {c.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
