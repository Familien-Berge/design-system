export interface Fill {
  iso: string;
  date: string;
  station: string;
  liters: number;
  price: number;
  verified: boolean;
}

export const fills: Fill[] = [
  { iso: "2026-11-01", date: "01.11.2026", station: "Circle K Sandvika", liters: 41.2, price: 19.72, verified: true },
  { iso: "2026-10-24", date: "24.10.2026", station: "Uno-X Lysaker", liters: 38.9, price: 19.67, verified: true },
  { iso: "2026-10-15", date: "15.10.2026", station: "Esso Bekkestua", liters: 35.0, price: 19.71, verified: false },
  { iso: "2026-10-06", date: "06.10.2026", station: "Circle K Sandvika", liters: 43.6, price: 20.14, verified: true },
  { iso: "2026-09-27", date: "27.09.2026", station: "YX Høvik", liters: 29.8, price: 20.39, verified: true },
];

export interface App {
  name: string;
  url: string;
  version: string;
  tone: "green" | "blue" | "amber" | "red";
  state: string;
  uptime: number;
}

export const apps: App[] = [
  { name: "kokebok", url: "kokebok.example.com", version: "1.4.3", tone: "green", state: "Healthy", uptime: 99.98 },
  { name: "drivstoff", url: "drivstoff.example.com", version: "2.1.0", tone: "blue", state: "Deploying", uptime: 99.9 },
  { name: "ladelaug", url: "ladelaug.example.com", version: "0.9.2", tone: "green", state: "Healthy", uptime: 100 },
  { name: "ynab-auto-sync", url: "ynab.example.com", version: "3.0.1", tone: "amber", state: "Out of sync", uptime: 99.4 },
  { name: "ha-load-balancer", url: "last.example.com", version: "1.2.0", tone: "red", state: "Unhealthy", uptime: 97.2 },
];

/** Car costs per month, kr, by category: a stacked bar. */
export interface MonthCost {
  month: string;
  fuel: number;
  service: number;
  insurance: number;
  tolls: number;
  other: number;
}

export const monthCosts: MonthCost[] = [
  ["2025-12", 1840, 0, 812, 410, 0],
  ["2026-01", 2210, 0, 812, 455, 120],
  ["2026-02", 1980, 3450, 812, 390, 0],
  ["2026-03", 2105, 0, 812, 470, 0],
  ["2026-04", 2320, 0, 812, 505, 640],
  ["2026-05", 2480, 0, 812, 520, 0],
  ["2026-06", 2890, 0, 812, 610, 210],
  ["2026-07", 3310, 0, 812, 380, 0],
  ["2026-08", 2560, 6120, 812, 540, 0],
  ["2026-09", 2240, 0, 812, 498, 95],
  ["2026-10", 2390, 0, 812, 515, 0],
  ["2026-11", 1610, 0, 812, 260, 0],
].map(([month, fuel, service, insurance, tolls, other]) => ({ month, fuel, service, insurance, tolls, other }) as MonthCost);

/** Pump price per litre, kr, two fuels: a two-series line. */
export const fuelPrices = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 9, 5 + i));
  const wave = Math.sin(i / 3.2) * 0.35 + (i / 30) * 0.4;
  return { date: day.toISOString().slice(0, 10), petrol: +(19.6 + wave).toFixed(2), diesel: +(18.4 + wave * 0.8 - 0.1).toFixed(2) };
});

/** Fuel consumption per month, l/mil: a single-series bar. */
export const consumption = monthCosts.map((m, i) => ({ month: m.month, lPerMil: +(0.58 + Math.sin(i / 2) * 0.05 + (i % 3) * 0.01).toFixed(2) }));
