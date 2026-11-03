import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, CircleX, Clock, Fuel, GitCompareArrows, Hand, Inbox, Loader2, Plus, Receipt, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { StatGrid, StatTile } from "@/components/stat-tile";
import { StatusDot, StatusIcon, StatusPill, type Tone } from "@/components/status";
import { fills, type Fill } from "./sample-data";

const meta: Meta = { title: "Blocks" };
export default meta;
type Story = StoryObj;

const tones: [Tone, string][] = [
  ["green", "OK"],
  ["blue", "In progress"],
  ["violet", "Waiting on someone"],
  ["amber", "Needs attention"],
  ["red", "Broken"],
  ["gray", "Unknown / inactive"],
];

export const Status: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        {tones.map(([tone, label]) => (
          <div key={tone} className="flex items-center gap-3 text-sm">
            <StatusDot tone={tone} label={label} pulse={tone === "blue"} ping={tone === "red"} />
            <StatusPill tone={tone}>{label}</StatusPill>
            <code className="text-xs text-muted-foreground">{tone}</code>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusPill tone="green">
          <CircleCheck /> Synced
        </StatusPill>
        <StatusPill tone="amber">
          <GitCompareArrows /> Out of sync
        </StatusPill>
        <StatusPill tone="blue">
          <Loader2 className="animate-spin" /> Building
        </StatusPill>
        <StatusPill tone="violet">
          <Hand /> Awaiting approval
        </StatusPill>
        <StatusPill tone="red">
          <CircleX /> Failed
        </StatusPill>
        <StatusPill className="border text-muted-foreground bg-transparent">docker</StatusPill>
      </div>
      <div className="flex gap-2">
        <StatusIcon tone="green">
          <CircleCheck />
        </StatusIcon>
        <StatusIcon tone="gray">
          <Clock />
        </StatusIcon>
        <StatusIcon tone="red">
          <CircleX />
        </StatusIcon>
      </div>
    </div>
  ),
};

export const StatTiles: Story = {
  render: () => (
    <StatGrid>
      <StatTile label="Snittforbruk" value="0,62 l/mil" icon={Fuel} delta={{ value: "4 %", direction: "down", good: true }} sub="siste 30 dager" />
      <StatTile label="Kostnad i år" value="18 240 kr" icon={Wallet} delta={{ value: "12 %", direction: "up", good: false }} sub="mot i fjor" />
      <StatTile label="Lading" value="412 kWh" icon={Zap} sub="oktober" />
      <StatTile label="Utestående" value="1 280 kr" icon={Receipt} sub="3 medlemmer" />
    </StatGrid>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      icon={Inbox}
      title="Ingen fyllinger ennå"
      description="Registrer den første fyllingen, så kommer forbruk og kostnader her."
      action={
        <Button>
          <Plus /> Ny fylling
        </Button>
      }
    />
  ),
};

const columns: Column<Fill>[] = [
  { key: "date", header: "Dato", render: (f) => f.date, sortValue: (f) => f.iso, card: "title" },
  { key: "station", header: "Stasjon", render: (f) => f.station, sortValue: (f) => f.station, card: "title" },
  { key: "liters", header: "Liter", render: (f) => f.liters.toFixed(2), sortValue: (f) => f.liters, className: "text-right tabular-nums" },
  {
    key: "price",
    header: "Pris/l",
    render: (f) => `${f.price.toFixed(2)} kr`,
    sortValue: (f) => f.price,
    className: "text-right tabular-nums hidden @2xl:table-cell",
  },
  { key: "total", header: "Beløp", render: (f) => `${(f.liters * f.price).toFixed(2)} kr`, sortValue: (f) => f.liters * f.price, className: "text-right tabular-nums" },
  {
    key: "status",
    header: "Status",
    render: (f) => <StatusPill tone={f.verified ? "green" : "amber"}>{f.verified ? "Bekreftet" : "Sjekk kvittering"}</StatusPill>,
    sortValue: (f) => (f.verified ? 1 : 0),
  },
];

export const DataTableBlock: Story = {
  name: "Data table",
  parameters: {
    docs: { description: { story: "Switch the toolbar viewport to a phone to see the card layout and sort picker." } },
  },
  render: () => <DataTable columns={columns} rows={fills} rowKey={(f) => f.iso} defaultSortLabel="Standard rekkefølge" />,
};

export const DataTableEmpty: Story = {
  name: "Data table (empty)",
  render: () => <DataTable columns={columns} rows={[]} rowKey={(f) => f.iso} empty="Ingen fyllinger i perioden." />,
};
