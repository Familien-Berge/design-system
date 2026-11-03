import * as React from "react";
import { Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * Renders a nav link. Pass your router's Link, e.g. `({ href, ...p }) => <Link to={href} {...p} />`.
 * It must pass the rest of its props on to the <a>: the sidebar styles active rows and places
 * badges through data-* attributes it adds there.
 */
export type ShellLink = React.ComponentType<React.ComponentProps<"a"> & { href: string }>;

export type ShellNavItem = {
  label: string;
  icon?: LucideIcon;
  /** Small count or marker at the end of the row, e.g. the number of failing items. */
  badge?: React.ReactNode;
  badgeClassName?: string;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

export interface AppShellProps {
  /** `logo` (e.g. the app's own <img>) replaces the default icon tile, which is `icon` on --brand. */
  brand: { name: string; subtitle?: React.ReactNode; icon?: LucideIcon; logo?: React.ReactNode; href?: string };
  nav: ShellNavItem[];
  /** Rows pinned to the bottom of the sidebar (user view, sign out…). */
  footerNav?: ShellNavItem[];
  /** Small print under the footer rows, e.g. the app version. */
  footer?: React.ReactNode;
  /** Left side of the top bar, after the sidebar toggle (search, breadcrumbs). */
  topbar?: React.ReactNode;
  /** Right side of the top bar, before the theme toggle. */
  actions?: React.ReactNode;
  isActive?: (href: string) => boolean;
  linkComponent?: ShellLink;
  children: React.ReactNode;
}

const PlainLink: ShellLink = ({ href, ...props }) => <a href={href} {...props} />;

const defaultIsActive = (href: string) =>
  typeof window !== "undefined" && (window.location.pathname === href || window.location.pathname.startsWith(`${href}/`));

function NavRows({
  items,
  isActive,
  Link,
}: {
  items: ShellNavItem[];
  isActive: (href: string) => boolean;
  Link: ShellLink;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  // The mobile sidebar is a sheet; close it once a row is picked.
  const close = () => isMobile && setOpenMobile(false);
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href ?? item.label}>
          {item.href !== undefined ? (
            <SidebarMenuButton asChild tooltip={item.label} isActive={isActive(item.href)}>
              <Link href={item.href} onClick={close}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              tooltip={item.label}
              onClick={() => {
                close();
                item.onClick();
              }}
            >
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </SidebarMenuButton>
          )}
          {item.badge !== undefined && item.badge !== null && item.badge !== false && (
            <SidebarMenuBadge className={item.badgeClassName}>{item.badge}</SidebarMenuBadge>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function ShellSidebar({
  brand,
  nav,
  footerNav,
  footer,
  isActive,
  Link,
}: Pick<AppShellProps, "brand" | "nav" | "footerNav" | "footer"> & { isActive: (href: string) => boolean; Link: ShellLink }) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={brand.href ?? "/"} onClick={() => isMobile && setOpenMobile(false)}>
                {brand.logo ? (
                  <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg [&>img]:size-full">
                    {brand.logo}
                  </div>
                ) : (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                    {brand.icon && <brand.icon className="size-4" />}
                  </div>
                )}
                <div className="grid leading-tight">
                  <span className="truncate font-semibold">{brand.name}</span>
                  {brand.subtitle && <span className="truncate text-xs text-muted-foreground">{brand.subtitle}</span>}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavRows items={nav} isActive={isActive} Link={Link} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {(footerNav?.length || footer) && (
        <SidebarFooter>
          {footerNav?.length ? <NavRows items={footerNav} isActive={isActive} Link={Link} /> : null}
          {footer && (
            <div className="px-2 font-mono text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
              {footer}
            </div>
          )}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

/** Light/dark switch. Needs next-themes' ThemeProvider (attribute="class") around the app. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={dark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

/**
 * Sidebar + sticky top bar layout. The sidebar collapses to icons on desktop (⌘B) and becomes a
 * sheet on phones, opened from the top bar.
 */
export function AppShell({
  brand,
  nav,
  footerNav,
  footer,
  topbar,
  actions,
  isActive = defaultIsActive,
  linkComponent = PlainLink,
  children,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <ShellSidebar brand={brand} nav={nav} footerNav={footerNav} footer={footer} isActive={isActive} Link={linkComponent} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
          <SidebarTrigger />
          {/* The sidebar (and with it the app's name) is hidden on phones until opened. */}
          <span className="truncate text-sm font-semibold md:hidden">{brand.name}</span>
          {topbar}
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Title row at the top of a page: title, optional description, and actions on the right. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4 pb-4 md:px-6 md:pt-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <div className="mt-1 text-sm text-muted-foreground">{description}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Page body under a PageHeader, with the same side padding. */
export function PageContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4 px-4 pb-8 md:px-6", className)} {...props} />;
}
