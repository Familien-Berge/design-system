import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FormField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Meter, Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/combobox";
import { ConfirmDialog, FormDialog } from "@/components/form-dialog";
import { MultiSelect } from "@/components/multi-select";
import { DataTable, type Column } from "@/components/data-table";
import { ErrorState } from "@/components/empty-state";
import { LabelsProvider, nb } from "@/lib/labels";
import { fills, type Fill } from "./sample-data";

const meta: Meta = { title: "Blocks/Forms & states" };
export default meta;
type Story = StoryObj;

function FillForm({ id }: { id: string }) {
  const [liters, setLiters] = useState("41,2");
  const bad = !/^\d+([.,]\d+)?$/.test(liters);
  return (
    <form id={id} onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="liters">Liter</FieldLabel>
          <Input id="liters" inputMode="decimal" value={liters} onChange={(e) => setLiters(e.target.value)} aria-invalid={bad} />
          <FieldDescription>Fra pumpen, med desimaler.</FieldDescription>
          <FieldError>{bad && "Skriv et tall, f.eks. 41,2"}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Drivstoff</FieldLabel>
          <RadioGroup defaultValue="95" className="flex gap-4">
            {["95", "98", "Diesel"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <RadioGroupItem value={v} /> {v}
              </label>
            ))}
          </RadioGroup>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="full">Full tank</FieldLabel>
          <Switch id="full" defaultChecked />
        </Field>
        <label className="flex items-center gap-2">
          <Checkbox defaultChecked /> Kvittering bekreftet
        </label>
      </FieldGroup>
    </form>
  );
}

export const Dialogs: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    return (
      <LabelsProvider labels={nb}>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Ny fylling</Button>
          <Button variant="outline" onClick={() => setConfirm(true)}>
            <Trash2 /> Slett fylling
          </Button>
        </div>
        <FormDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Ny fylling"
          description="Golf 2019 · EK 12345"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit" form="fill">
                Lagre
              </Button>
            </>
          }
        >
          <FillForm id="fill" />
        </FormDialog>
        <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => setConfirm(false)} title="Slette fyllingen?">
          41,20 l hos Circle K Sandvika 1. november. Kan ikke angres.
        </ConfirmDialog>
      </LabelsProvider>
    );
  },
};

export const Fields: Story = { render: () => <div className="max-w-sm"><FillForm id="f" /></div> };

export const ProgressAndMeter: Story = {
  name: "Progress & meter",
  render: () => (
    <div className="grid max-w-sm gap-4 text-sm">
      <div className="grid gap-1.5">
        Synkroniserer… 60 %
        <Progress value={60} aria-label="Synkronisering" />
      </div>
      {([["green", 2.1], ["amber", 4.4], ["red", 5.6]] as const).map(([tone, v]) => (
        <div key={tone} className="grid gap-1.5">
          <div className="flex justify-between">
            <span>Denne timen</span>
            <span className="tabular-nums">{v.toLocaleString("nb-NO")} / 5 kWh</span>
          </div>
          <Meter value={v} max={5} tone={tone} label="Forbruk denne timen" />
        </div>
      ))}
    </div>
  ),
};

const columns: Column<Fill>[] = [
  { key: "date", header: "Dato", render: (f) => f.date, card: "title" },
  { key: "station", header: "Stasjon", render: (f) => f.station },
];

export const TableStates: Story = {
  name: "Data table: loading / error",
  render: () => (
    <LabelsProvider labels={nb}>
      <div className="grid gap-6">
        <DataTable columns={columns} rows={[]} rowKey={(f) => f.iso} loading />
        <DataTable columns={columns} rows={fills} rowKey={(f) => f.iso} error="Fikk ikke kontakt med serveren." onRetry={() => {}} />
        <ErrorState />
      </div>
    </LabelsProvider>
  ),
};

function ComboboxExample() {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-sm">
      <FieldGroup>
        <FormField label="Sensor" hint="Pick one, or type any entity id.">
          <Combobox
            value={value}
            onChange={setValue}
            options={[
              { value: "sensor.vvb_power", label: "Water heater" },
              { value: "sensor.ev_power", label: "EV charger" },
              { value: "sensor.house_power" },
            ]}
          />
        </FormField>
        <FormField label="Off in Holiday" orientation="horizontal">
          <Checkbox />
        </FormField>
      </FieldGroup>
    </div>
  );
}

export const ComboboxAndFormField: Story = { render: () => <ComboboxExample /> };

function MultiSelectExample() {
  const [value, setValue] = useState<string[]>(["shed", "ev"]);
  return (
    <MultiSelect
      aria-label="Type"
      className="w-40"
      value={value}
      onChange={setValue}
      allLabel="All types"
      options={[
        { value: "shed", label: "Shed" },
        { value: "restore", label: "Restore" },
        { value: "ev", label: "EV" },
        { value: "system", label: "System" },
      ]}
    />
  );
}

export const MultiSelectFilter: Story = { render: () => <MultiSelectExample /> };
