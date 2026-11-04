import * as React from "react";

/**
 * The words the design system's own components say (buttons, screen-reader names, empty and
 * error states). English by default; wrap the app in `<LabelsProvider labels={nb}>` for Norwegian,
 * or pass a partial object to change a few: `labels={{ ...nb, empty: "Ingen fyllinger" }}`.
 * A component's own prop (e.g. DataTable's `empty`) still wins over these.
 */
export const en = {
  close: "Close",
  cancel: "Cancel",
  confirm: "Confirm",
  delete: "Delete",
  actions: "Actions",
  empty: "Nothing here yet.",
  loading: "Loading…",
  error: "Something went wrong.",
  retry: "Try again",
  defaultOrder: "Default order",
  sortBy: "Sort by",
  ascending: "Ascending",
  descending: "Descending",
  lightMode: "Light mode",
  darkMode: "Dark mode",
  toggleSidebar: "Toggle sidebar",
  chart: "Chart",
  table: "Table",
};

export type Labels = typeof en;

export const nb: Labels = {
  close: "Lukk",
  cancel: "Avbryt",
  confirm: "Bekreft",
  delete: "Slett",
  actions: "Handlinger",
  empty: "Ingenting her ennå.",
  loading: "Laster…",
  error: "Noe gikk galt.",
  retry: "Prøv igjen",
  defaultOrder: "Standard rekkefølge",
  sortBy: "Sorter etter",
  ascending: "Stigende",
  descending: "Synkende",
  lightMode: "Lyst tema",
  darkMode: "Mørkt tema",
  toggleSidebar: "Vis/skjul sidemeny",
  chart: "Diagram",
  table: "Tabell",
};

const LabelsContext = React.createContext<Labels>(en);

export function LabelsProvider({ labels, children }: { labels: Partial<Labels>; children: React.ReactNode }) {
  const parent = React.useContext(LabelsContext);
  const value = React.useMemo(() => ({ ...parent, ...labels }), [parent, labels]);
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

export function useLabels() {
  return React.useContext(LabelsContext);
}
