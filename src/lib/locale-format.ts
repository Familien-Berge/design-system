// Number and date formatting for tables, stat tiles, chart axes and tooltips. Norwegian by default
// (the apps are), with the locale as the last argument for anything else. Formatters are cached:
// building an Intl formatter is far slower than using one, and an axis calls this per tick.

const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();
function nf(locale: string, opts: Intl.NumberFormatOptions) {
  const key = `n|${locale}|${JSON.stringify(opts)}`;
  let f = cache.get(key) as Intl.NumberFormat | undefined;
  if (!f) cache.set(key, (f = new Intl.NumberFormat(locale, opts)));
  return f;
}
function df(locale: string, opts: Intl.DateTimeFormatOptions) {
  const key = `d|${locale}|${JSON.stringify(opts)}`;
  let f = cache.get(key) as Intl.DateTimeFormat | undefined;
  if (!f) cache.set(key, (f = new Intl.DateTimeFormat(locale, opts)));
  return f;
}

export const DEFAULT_LOCALE = "nb-NO";

type Num = number | null | undefined;
const blank = (v: Num): v is null | undefined => v === null || v === undefined || Number.isNaN(v);

/** 12 345,6 — up to `decimals` decimals (default 2), fewer when they're zeros. "–" for no value. */
export function formatNumber(v: Num, decimals = 2, locale = DEFAULT_LOCALE) {
  return blank(v) ? "–" : nf(locale, { maximumFractionDigits: decimals }).format(v);
}

/** 12 345,60 kr — always `decimals` decimals (default 2; 0 for whole kroner). */
export function formatCurrency(v: Num, { currency = "NOK", decimals = 2, locale = DEFAULT_LOCALE } = {}) {
  if (blank(v)) return "–";
  return nf(locale, { style: "currency", currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}

/** 0.123 → 12,3 %. */
export function formatPercent(v: Num, decimals = 1, locale = DEFAULT_LOCALE) {
  return blank(v) ? "–" : nf(locale, { style: "percent", maximumFractionDigits: decimals }).format(v);
}

/**
 * Short form for axis ticks and tight spaces: in full under 10 000 (2 500), compact from there
 * (12k, 1,2 mill.). One style per axis reads best, so pass the axis' largest value as `scale`.
 */
export function formatCompact(v: Num, { scale, locale = DEFAULT_LOCALE }: { scale?: number; locale?: string } = {}) {
  if (blank(v)) return "–";
  if (Math.abs(scale ?? v) < 10_000) return nf(locale, { maximumFractionDigits: 1 }).format(v);
  return nf(locale, { notation: "compact", maximumFractionDigits: 1 }).format(v);
}

const toDate = (d: Date | string | number) => (d instanceof Date ? d : new Date(d));

const dateStyles = {
  /** 3. nov. 2026 */
  medium: { day: "numeric", month: "short", year: "numeric" },
  /** 03.11.2026 */
  numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
  /** 3. nov. — axis ticks within one year */
  day: { day: "numeric", month: "short" },
  /** nov. 2026 */
  month: { month: "short", year: "numeric" },
  /** nov. — monthly axis ticks within one year */
  monthShort: { month: "short" },
  /** 14:05 */
  time: { hour: "2-digit", minute: "2-digit" },
  /** 3. nov., 14:05 */
  dateTime: { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

/** Dates and times in one of a few named styles. Accepts a Date, an ISO string or epoch ms. */
export function formatDate(d: Date | string | number | null | undefined, style: keyof typeof dateStyles = "medium", locale = DEFAULT_LOCALE) {
  if (d === null || d === undefined || d === "") return "–";
  const date = toDate(d);
  return Number.isNaN(date.getTime()) ? "–" : df(locale, dateStyles[style]).format(date);
}
