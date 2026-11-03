import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Area, AreaChart, XAxis, YAxis } from "recharts";
import { Fuel, Gauge, Wallet, Zap } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartCard, ChartTable, chartDefaults, seriesConfig } from "@/components/charts";
import { Sparkline } from "@/components/sparkline";
import { StatGrid, StatTile } from "@/components/stat-tile";
import { formatCompact, formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { consumption, fuelPrices, monthCosts } from "./sample-data";

const meta: Meta = { title: "Blocks/Charts" };
export default meta;
type Story = StoryObj;

const month = (m: unknown) => formatDate(`${m}-01`, "monthShort");
const kr = (v: unknown) => formatCurrency(Number(v), { decimals: 0 });

// Every series the chart can show, in a fixed order; built once, so colours never move.
const costConfig = seriesConfig({
  fuel: "Drivstoff",
  service: "Verksted",
  insurance: "Forsikring",
  tolls: "Bompenger",
  other: { label: "Annet", color: "var(--muted-foreground)" },
});
const costMax = Math.max(...monthCosts.map((m) => m.fuel + m.service + m.insurance + m.tolls + m.other));

export const StackedBar: Story = {
  name: "Stacked bar",
  render: () => (
    <ChartCard
      title="Kostnader per måned"
      description="Siste 12 måneder"
      labels={{ chart: "Diagram", table: "Tabell" }}
      table={<ChartTable data={monthCosts} config={costConfig} x={{ key: "month", label: "Måned", format: (m) => formatDate(`${m}-01`, "month") }} format={kr} />}
    >
      <ChartContainer config={costConfig} className="aspect-auto h-64 w-full md:h-72">
        <BarChart data={monthCosts} margin={chartDefaults.margin}>
          <CartesianGrid {...chartDefaults.grid} />
          <XAxis dataKey="month" {...chartDefaults.xAxis} tickFormatter={month} />
          <YAxis {...chartDefaults.yAxis} tickFormatter={(v) => formatCompact(v, { scale: costMax })} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => formatDate(`${l}-01`, "month")} valueFormatter={kr} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="fuel" stackId="a" fill="var(--color-fuel)" {...chartDefaults.segment} />
          <Bar dataKey="service" stackId="a" fill="var(--color-service)" {...chartDefaults.segment} />
          <Bar dataKey="insurance" stackId="a" fill="var(--color-insurance)" {...chartDefaults.segment} />
          <Bar dataKey="tolls" stackId="a" fill="var(--color-tolls)" {...chartDefaults.segment} />
          <Bar dataKey="other" stackId="a" fill="var(--color-other)" {...chartDefaults.segmentTop} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  ),
};

const consumptionConfig = seriesConfig({ lPerMil: "Forbruk (l/mil)" });

export const SingleBar: Story = {
  name: "Bar (one series)",
  render: () => (
    <ChartCard
      title="Forbruk"
      description="Liter per mil, per måned"
      labels={{ chart: "Diagram", table: "Tabell" }}
      table={<ChartTable data={consumption} config={consumptionConfig} x={{ key: "month", label: "Måned", format: (m) => formatDate(`${m}-01`, "month") }} format={(v) => formatNumber(Number(v))} />}
    >
      {/* One series: no legend, the title names it. */}
      <ChartContainer config={consumptionConfig} className="aspect-auto h-56 w-full">
        <BarChart data={consumption} margin={chartDefaults.margin}>
          <CartesianGrid {...chartDefaults.grid} />
          <XAxis dataKey="month" {...chartDefaults.xAxis} tickFormatter={month} />
          <YAxis {...chartDefaults.yAxis} domain={[0, "auto"]} tickFormatter={(v) => formatNumber(v)} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => formatDate(`${l}-01`, "month")} valueFormatter={(v) => `${formatNumber(Number(v))} l/mil`} />} />
          <Bar dataKey="lPerMil" fill="var(--color-lPerMil)" {...chartDefaults.bar} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  ),
};

const priceConfig = seriesConfig({ petrol: "Bensin 95", diesel: "Diesel" });

export const Lines: Story = {
  name: "Line (two series)",
  render: () => (
    <ChartCard
      title="Pumpepris"
      description="Kr per liter, siste 30 dager"
      labels={{ chart: "Diagram", table: "Tabell" }}
      table={<ChartTable data={fuelPrices} config={priceConfig} x={{ key: "date", label: "Dato", format: (d) => formatDate(String(d)) }} format={(v) => formatNumber(Number(v))} />}
    >
      <ChartContainer config={priceConfig} className="aspect-auto h-60 w-full">
        <LineChart data={fuelPrices} margin={chartDefaults.margin}>
          <CartesianGrid {...chartDefaults.grid} />
          <XAxis dataKey="date" {...chartDefaults.xAxis} tickFormatter={(d) => formatDate(d, "day")} />
          <YAxis {...chartDefaults.yAxis} domain={["auto", "auto"]} tickFormatter={(v) => formatNumber(v, 1)} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={(l) => formatDate(String(l))} valueFormatter={(v) => `${formatNumber(Number(v))} kr`} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="petrol" stroke="var(--color-petrol)" {...chartDefaults.line} />
          <Line dataKey="diesel" stroke="var(--color-diesel)" {...chartDefaults.line} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  ),
};

const fuelConfig = seriesConfig({ fuel: "Drivstoff" });

export const AreaStory: Story = {
  name: "Area (one series)",
  render: () => (
    <ChartCard title="Drivstoffkostnad" description="Kr per måned">
      <ChartContainer config={fuelConfig} className="aspect-auto h-48 w-full">
        <AreaChart data={monthCosts} margin={chartDefaults.margin}>
          <CartesianGrid {...chartDefaults.grid} />
          <XAxis dataKey="month" {...chartDefaults.xAxis} tickFormatter={month} />
          <YAxis {...chartDefaults.yAxis} tickFormatter={(v) => formatCompact(v)} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={(l) => formatDate(`${l}-01`, "month")} valueFormatter={kr} />} />
          <Area dataKey="fuel" stroke="var(--color-fuel)" fill="var(--color-fuel)" {...chartDefaults.area} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  ),
};

export const Sparklines: Story = {
  name: "Sparklines in stat tiles",
  render: () => (
    <div className="grid gap-6">
      <StatGrid>
        <StatTile
          label="Snittforbruk"
          value="0,62 l/mil"
          icon={Fuel}
          delta={{ value: "4 %", direction: "down", good: true }}
          sub="30 dager"
          trend={{ data: consumption.map((c) => c.lPerMil), label: "Forbruk siste 12 måneder" }}
        />
        <StatTile
          label="Kostnad i år"
          value="18 240 kr"
          icon={Wallet}
          delta={{ value: "12 %", direction: "up", good: false }}
          sub="mot i fjor"
          trend={{ data: monthCosts.map((m) => m.fuel + m.service + m.insurance + m.tolls + m.other), label: "Kostnad per måned" }}
        />
        <StatTile label="Lading" value="412 kWh" icon={Zap} sub="oktober" trend={{ data: [380, 402, 371, null, 395, 430, 412], color: "var(--chart-3)" }} />
        <StatTile label="Kilometerstand" value="84 120" icon={Gauge} sub="oppdatert i går" />
      </StatGrid>
      <div className="flex items-center gap-3 text-sm">
        Inline in text or a table cell: <Sparkline data={fuelPrices.map((p) => p.petrol)} area />
      </div>
    </div>
  ),
};
