import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Bold, Calculator, ChevronDown, Italic, LogOut, Plus, Search, Settings, Trash2, Underline, User } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const meta: Meta = { title: "Primitives" };
export default meta;
type Story = StoryObj;

const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap items-center gap-2">{children}</div>;

export const Buttons: Story = {
  render: () => (
    <div className="grid gap-4">
      <Row>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Row>
      <Row>
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button>default</Button>
        <Button size="lg">lg</Button>
        <Button size="icon-sm" variant="outline" aria-label="Settings">
          <Settings />
        </Button>
        <Button size="icon" variant="outline" aria-label="Settings">
          <Settings />
        </Button>
      </Row>
      <Row>
        <Button>
          <Plus /> New service
        </Button>
        <Button variant="outline">
          Options <ChevronDown data-icon="inline-end" />
        </Button>
        <Button disabled>Disabled</Button>
      </Row>
    </div>
  ),
};

export const Badges: Story = {
  render: () => (
    <Row>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </Row>
  ),
};

export const Cards: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Runtime</CardTitle>
          <CardDescription>Container settings applied on the next deploy.</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground">Port 5006 · restart unless-stopped · 2 volumes</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delete service</CardTitle>
          <CardDescription>Stops tracking it. The container keeps running.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end border-t pt-4">
          <Button variant="destructive" size="sm">
            <Trash2 /> Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Forms: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="kokebok" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="search">Search</Label>
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput id="search" placeholder="Filter…" />
          </InputGroup>
        </div>
        <div className="grid gap-1.5">
          <Label>Kind</Label>
          <Select defaultValue="docker">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="docker">Docker</SelectItem>
              <SelectItem value="static">Static</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Anything worth knowing…" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="bad">With an error</Label>
          <Input id="bad" aria-invalid defaultValue="not a url" />
          <p className="text-xs text-destructive">Must start with https://</p>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto">Deploy automatically</Label>
          <Switch id="auto" defaultChecked />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const Overlays: Story = {
  render: () => (
    <Row>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Roll back kokebok?</DialogTitle>
            <DialogDescription>Redeploys 1.4.2, the release before the current one.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Roll back</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Side panel; on phones the sidebar uses this too.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Menu <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>you@example.com</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User /> Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Popover</Button>
        </PopoverTrigger>
        <PopoverContent className="text-sm">Free-form content anchored to the trigger.</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <Button variant="outline" onClick={() => toast.success("Deployed kokebok 1.4.3")}>
        Toast
      </Button>
    </Row>
  ),
};

export const TabsAndToggles: Story = {
  name: "Tabs & toggles",
  render: () => (
    <div className="grid max-w-md gap-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-2 text-sm text-muted-foreground">
          Overview content
        </TabsContent>
        <TabsContent value="deployments" className="pt-2 text-sm text-muted-foreground">
          Deployments content
        </TabsContent>
        <TabsContent value="logs" className="pt-2 text-sm text-muted-foreground">
          Logs content
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="a">
        <TabsList variant="line">
          <TabsTrigger value="a">Line</TabsTrigger>
          <TabsTrigger value="b">Variant</TabsTrigger>
        </TabsList>
      </Tabs>
      <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const Alerts: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Alert>
        <Bell />
        <AlertTitle>Deployments paused: maintenance</AlertTitle>
        <AlertDescription>New releases queue up until this is lifted.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Health check failed</AlertTitle>
        <AlertDescription>/healthz returned 502 three times in a row.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const TableAndList: Story = {
  name: "Table",
  render: () => (
    <Card className="max-w-2xl overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Dato</TableHead>
            <TableHead>Stasjon</TableHead>
            <TableHead className="pr-4 text-right">Beløp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["01.11.2026", "Circle K Sandvika", "812,40 kr"],
            ["24.10.2026", "Uno-X Lysaker", "765,10 kr"],
            ["15.10.2026", "Esso Bekkestua", "690,00 kr"],
          ].map(([d, s, b]) => (
            <TableRow key={d}>
              <TableCell className="pl-4">{d}</TableCell>
              <TableCell>{s}</TableCell>
              <TableCell className="pr-4 text-right tabular-nums">{b}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  ),
};

export const CommandPalette: Story = {
  name: "Command",
  render: () => (
    <Command className="max-w-md rounded-xl ring-1 ring-foreground/10">
      <CommandInput placeholder="Search or run a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Go to">
          <CommandItem>
            <Calculator /> rpn-calc
          </CommandItem>
          <CommandItem>
            <Settings /> Settings <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Misc: Story = {
  name: "Avatar, skeleton, separator",
  render: () => (
    <div className="grid max-w-sm gap-4">
      <Row>
        <Avatar>
          <AvatarFallback>TB</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </Row>
      <Separator />
      <div className="grid gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </div>
  ),
};
