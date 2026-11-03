import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "Foundations" };
export default meta;
type Story = StoryObj;

const colors = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["brand", "brand-foreground"],
  ["destructive", "background"],
] as const;

export const Colors: Story = {
  render: () => (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {colors.map(([bg, fg]) => (
          <div key={bg} className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
            <div className="flex h-16 items-end p-2 text-xs font-medium" style={{ background: `var(--${bg})`, color: `var(--${fg})` }}>
              Aa
            </div>
            <div className="bg-card px-2 py-1.5 font-mono text-[11px] text-muted-foreground">{bg}</div>
          </div>
        ))}
        {(["border", "input", "ring"] as const).map((c) => (
          <div key={c} className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
            <div className="h-16 bg-background p-2">
              <div className="h-full rounded-md border-2" style={{ borderColor: `var(--${c})` }} />
            </div>
            <div className="bg-card px-2 py-1.5 font-mono text-[11px] text-muted-foreground">{c}</div>
          </div>
        ))}
      </div>
      <p className="max-w-prose text-sm text-muted-foreground">
        Everything is neutral; colour means status (see Blocks → Status). The one exception is <code>--brand</code>: an app's
        own accent for its logo tile. Try the Brand toolbar.
      </p>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Page title · text-xl semibold tracking-tight</h1>
      <h2 className="text-base font-semibold">Section / card title · text-base semibold</h2>
      <p className="text-sm">Body · text-sm. Most of the UI is this size, in Geist.</p>
      <p className="text-sm text-muted-foreground">Secondary · text-sm text-muted-foreground</p>
      <p className="text-xs text-muted-foreground">Meta · text-xs, timestamps, hints</p>
      <p className="font-mono text-xs">Mono · versions, digests, log lines: sha-47be8a7</p>
      <p className="text-xl font-semibold tabular-nums">12 345,67 kr · tabular-nums for numbers that line up</p>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {["rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl"].map((r) => (
        <div key={r} className="grid justify-items-center gap-1">
          <div className={`size-16 bg-muted ring-1 ring-foreground/10 ${r}`} />
          <code className="text-[11px] text-muted-foreground">{r}</code>
        </div>
      ))}
    </div>
  ),
};
