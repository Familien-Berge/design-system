import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink, Fuel, Gauge, LayoutDashboard, LogOut, Plus, Receipt, Search, Settings, Wallet, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppShell, PageContent, PageHeader, type ShellLink } from "@/components/app-shell";
import { DataTable, type Column } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatGrid, StatTile } from "@/components/stat-tile";
import { StatusDot, StatusPill } from "@/components/status";
import { apps, fills, type App, type Fill } from "./sample-data";

/** A whole app built only from the registry: what drivstoff / ladelaug / ynab would look like. */
function ExampleApp({ start = "/oversikt" }: { start?: string }) {
  const [path, setPath] = useState(start);
  const [adding, setAdding] = useState(false);
  // In a real app this is the router's Link; here clicks just switch the page.
  const Link: ShellLink = ({ href, onClick, ...props }) => (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        setPath(href);
        onClick?.(e);
      }}
    />
  );

  return (
    <AppShell
      brand={{ name: "drivstoff", subtitle: "Golf 2019 · EK 12345", icon: Fuel, href: "/oversikt" }}
      nav={[
        { href: "/oversikt", label: "Oversikt", icon: LayoutDashboard },
        { href: "/fyllinger", label: "Fyllinger", icon: Fuel },
        { href: "/service", label: "Service", icon: Wrench, badge: 1, badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
        { href: "/kostnader", label: "Kostnader", icon: Wallet },
        { href: "/tjenester", label: "Tjenester", icon: Gauge, badge: 1, badgeClassName: "bg-red-500/15 text-red-600 dark:text-red-400" },
        { href: "/innstillinger", label: "Innstillinger", icon: Settings },
      ]}
      footerNav={[{ label: "Logg ut", icon: LogOut, onClick: () => toast("Logget ut") }]}
      footer="v2.1.0"
      isActive={(href) => path === href}
      linkComponent={Link}
      topbar={
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Søk…" className="h-8 w-64 pl-8" />
        </div>
      }
      actions={
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> <span className="hidden sm:inline">Ny fylling</span>
        </Button>
      }
    >
      {path === "/oversikt" && <Overview />}
      {path === "/fyllinger" && <Fills />}
      {path === "/tjenester" && <Services />}
      {path === "/innstillinger" && <SettingsPage />}
      {!["/oversikt", "/fyllinger", "/tjenester", "/innstillinger"].includes(path) && (
        <>
          <PageHeader title={path.slice(1, 2).toUpperCase() + path.slice(2)} />
          <PageContent>
            <EmptyState icon={Receipt} title="Ingenting her ennå" description="Denne siden er tom i eksempelet." />
          </PageContent>
        </>
      )}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny fylling</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="l">Liter</Label>
              <Input id="l" inputMode="decimal" placeholder="41,20" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p">Pris per liter</Label>
              <Input id="p" inputMode="decimal" placeholder="19,72" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(false)}>
              Avbryt
            </Button>
            <Button
              onClick={() => {
                setAdding(false);
                toast.success("Fylling lagret");
              }}
            >
              Lagre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

const fillColumns: Column<Fill>[] = [
  { key: "date", header: "Dato", render: (f) => f.date, sortValue: (f) => f.iso, card: "title" },
  { key: "station", header: "Stasjon", render: (f) => f.station, sortValue: (f) => f.station, card: "title" },
  { key: "liters", header: "Liter", render: (f) => f.liters.toFixed(2), sortValue: (f) => f.liters, className: "text-right tabular-nums" },
  { key: "total", header: "Beløp", render: (f) => `${(f.liters * f.price).toFixed(2)} kr`, sortValue: (f) => f.liters * f.price, className: "text-right tabular-nums" },
  {
    key: "status",
    header: "Status",
    render: (f) => <StatusPill tone={f.verified ? "green" : "amber"}>{f.verified ? "Bekreftet" : "Sjekk kvittering"}</StatusPill>,
  },
];

function Overview() {
  return (
    <>
      <PageHeader title="Oversikt" description="Golf 2019 · 84 120 km" />
      <PageContent>
        <StatGrid>
          <StatTile label="Snittforbruk" value="0,62 l/mil" icon={Fuel} delta={{ value: "4 %", direction: "down", good: true }} sub="30 dager" />
          <StatTile label="Kostnad i år" value="18 240 kr" icon={Wallet} delta={{ value: "12 %", direction: "up", good: false }} sub="mot i fjor" />
          <StatTile label="Neste service" value="1 880 km" icon={Wrench} sub="eller 12. jan" />
          <StatTile label="Kilometerstand" value="84 120" icon={Gauge} sub="oppdatert i går" />
        </StatGrid>
        <h2 className="mt-2 text-base font-semibold">Siste fyllinger</h2>
        <DataTable columns={fillColumns} rows={fills.slice(0, 3)} rowKey={(f) => f.iso} onRowClick={(f) => toast(f.station)} />
      </PageContent>
    </>
  );
}

function Fills() {
  return (
    <>
      <PageHeader title="Fyllinger" description={`${fills.length} fyllinger`} />
      <PageContent>
        <DataTable columns={fillColumns} rows={fills} rowKey={(f) => f.iso} defaultSortLabel="Standard rekkefølge" onRowClick={(f) => toast(f.station)} />
      </PageContent>
    </>
  );
}

const appColumns: Column<App>[] = [
  {
    key: "name",
    header: "Tjeneste",
    render: (a) => (
      <span className="flex items-center gap-2">
        <StatusDot tone={a.tone} label={a.state} pulse={a.tone === "blue"} ping={a.tone === "red"} />
        <span className="font-medium">{a.name}</span>
      </span>
    ),
    sortValue: (a) => a.name,
    card: "title",
  },
  { key: "state", header: "Tilstand", render: (a) => <StatusPill tone={a.tone}>{a.state}</StatusPill>, sortValue: (a) => a.state },
  { key: "version", header: "Versjon", render: (a) => <span className="font-mono text-xs">{a.version}</span> },
  { key: "uptime", header: "Oppetid 30d", render: (a) => `${a.uptime} %`, sortValue: (a) => a.uptime, className: "text-right tabular-nums" },
  {
    key: "url",
    header: "Adresse",
    render: (a) => (
      <a href={`https://${a.url}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
        {a.url} <ExternalLink className="size-3" />
      </a>
    ),
    className: "hidden @3xl:table-cell",
    card: "footer",
  },
];

function Services() {
  return (
    <>
      <PageHeader
        title="Tjenester"
        description={
          <span className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5">
              <StatusDot tone="green" className="size-2" /> 2 ok
            </span>
            <span className="flex items-center gap-1.5">
              <StatusDot tone="red" className="size-2" /> 1 nede
            </span>
          </span>
        }
      />
      <PageContent>
        <DataTable columns={appColumns} rows={apps} rowKey={(a) => a.name} />
      </PageContent>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeader title="Innstillinger" />
      <PageContent className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Kjøretøy</CardTitle>
            <CardDescription>Vises i sidemenyen og på rapporter.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="n">Navn</Label>
              <Input id="n" defaultValue="Golf 2019" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="r">Registreringsnummer</Label>
              <Input id="r" defaultValue="EK 12345" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ocr">Les kvitteringer automatisk</Label>
              <Switch id="ocr" defaultChecked />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast.success("Lagret")}>Lagre</Button>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}

const meta: Meta<typeof ExampleApp> = {
  title: "Examples/App",
  component: ExampleApp,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ExampleApp>;

export const Desktop: Story = {};
export const Phone: Story = { globals: { viewport: { value: "mobile2", isRotated: false } } };
export const PhoneServices: Story = {
  name: "Phone: services list",
  args: { start: "/tjenester" },
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
