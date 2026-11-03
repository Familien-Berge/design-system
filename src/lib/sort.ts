import { useMemo, useState } from "react";

export type SortValue = string | number | null | undefined;
export interface SortState<K extends string> {
  key: K;
  dir: "asc" | "desc";
}

/**
 * Client-side column sorting. Clicking a column sorts ascending, then descending, then back to the
 * incoming order. Empty values always sort last; ties keep the incoming order.
 */
export function useSort<T, K extends string>(rows: T[], columns: Record<K, (row: T) => SortValue>, initial: SortState<NoInfer<K>> | null = null) {
  const [sort, setSort] = useState<SortState<K> | null>(initial);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = columns[sort.key];
    const sign = sort.dir === "asc" ? 1 : -1;
    return rows
      .map((row, i) => ({ row, i, v: get(row) }))
      .sort((a, b) => {
        const empty = (v: SortValue) => v === null || v === undefined || v === "";
        if (empty(a.v) || empty(b.v)) return empty(a.v) === empty(b.v) ? a.i - b.i : empty(a.v) ? 1 : -1;
        const c = typeof a.v === "number" && typeof b.v === "number" ? a.v - b.v : String(a.v).localeCompare(String(b.v), undefined, { numeric: true });
        return c * sign || a.i - b.i;
      })
      .map((x) => x.row);
    // columns is a fresh object each render; the sort only depends on the key/dir and the rows.
  }, [rows, sort]);
  const toggle = (key: K) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  return { rows: sorted, sort, toggle, setSort };
}

/** Rank by position in an ordered list (e.g. severity), so it sorts meaningfully instead of alphabetically. */
export const rank = <V extends string>(order: readonly V[]) => (v: V) => order.indexOf(v);
