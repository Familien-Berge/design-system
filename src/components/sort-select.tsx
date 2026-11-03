import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortState } from "@/lib/sort";

/** Sort picker for card lists on small screens, where there are no column headers to tap. */
export function SortSelect<K extends string>({
  labels,
  sort,
  onChange,
  defaultLabel = "Default order",
}: {
  labels: Partial<Record<K, string>>;
  sort: SortState<K> | null;
  onChange: (sort: SortState<K> | null) => void;
  defaultLabel?: string;
}) {
  const dir = sort?.dir ?? "asc";
  return (
    <div className="flex items-center gap-1">
      <Select value={sort?.key ?? "default"} onValueChange={(v) => onChange(v === "default" ? null : { key: v as K, dir })}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">{defaultLabel}</SelectItem>
          {(Object.entries(labels) as [K, string][]).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon-sm"
        disabled={!sort}
        aria-label={dir === "asc" ? "Ascending" : "Descending"}
        onClick={() => sort && onChange({ key: sort.key, dir: dir === "asc" ? "desc" : "asc" })}
      >
        {dir === "asc" ? <ArrowUp /> : <ArrowDown />}
      </Button>
    </div>
  );
}
