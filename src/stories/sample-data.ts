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
