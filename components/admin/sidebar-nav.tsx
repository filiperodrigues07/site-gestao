"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Download,
  FolderOpen,
  HelpCircle,
  Video,
  Users,
  Megaphone,
  Trophy,
  Newspaper,
  UserRound,
  Settings,
  LogOut,
  KeyRound,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { InstagramIcon } from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";
import type { AdminSection } from "@/lib/auth/permissions";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  section: AdminSection | "admin-only" | null;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Geral",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, section: null },
      { href: "/admin/ranking", label: "Ranking", icon: Trophy, section: null },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { href: "/admin/artigos", label: "Artigos", icon: FileText, section: "artigos" },
      { href: "/admin/downloads", label: "Downloads", icon: Download, section: "downloads" },
      { href: "/admin/categorias", label: "Categorias", icon: FolderOpen, section: "categorias" },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle, section: "faq" },
      { href: "/admin/videos", label: "Vídeos", icon: Video, section: "videos" },
      { href: "/admin/promocoes", label: "Promoções", icon: Megaphone, section: "promocoes" },
      { href: "/admin/novidades", label: "Novidades", icon: Newspaper, section: "novidades" },
      { href: "/admin/instagram", label: "Instagram", icon: InstagramIcon, section: "instagram" },
    ],
  },
  {
    label: "Área do cliente",
    items: [
      {
        href: "/admin/configuracoes-ch",
        label: "Configurações CH",
        icon: Settings,
        section: "portal-clientes",
      },
      {
        href: "/admin/portal-clientes",
        label: "Clientes",
        icon: UserRound,
        section: "portal-clientes",
      },
    ],
  },
  {
    label: "Conta",
    items: [
      { href: "/admin/usuarios", label: "Usuários", icon: Users, section: "admin-only" },
      { href: "/admin/senha", label: "Trocar senha", icon: KeyRound, section: null },
    ],
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function SidebarNav({
  currentUserName,
  isAdmin,
  permissions,
}: {
  currentUserName: string;
  isAdmin: boolean;
  permissions: string[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function toggleCollapsed() {
    setCollapsed((current) => !current);
  }

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (isAdmin) return true;
      if (item.section === null) return true;
      if (item.section === "admin-only") return false;
      return permissions.includes(item.section);
    }),
  })).filter((group) => group.items.length > 0);

  function renderNav(showLabels: boolean) {
    return (
      <nav className="scrollbar-hide flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group.label}>
            {showLabels && (
              <p className="px-3 text-[0.6875rem] font-semibold tracking-wider text-sidebar-foreground/40 uppercase">
                {group.label}
              </p>
            )}
            <div className={cn("space-y-0.5", showLabels && "mt-1.5")}>
              {group.items.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={showLabels ? undefined : item.label}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      !showLabels && "justify-center px-0"
                    )}
                  >
                    {active && (
                      <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                    {showLabels && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  function renderHeader(showLabels: boolean) {
    return (
      <div className={cn("flex items-center gap-2.5 p-4", !showLabels && "justify-center px-2")}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-5 w-auto" />
        </span>
        {showLabels && (
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-medium text-sidebar-foreground">
              Painel administrativo
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50">Base de Conhecimento</p>
          </div>
        )}
      </div>
    );
  }

  function renderFooter(showLabels: boolean) {
    return (
      <form action={logoutAction} className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-2.5 px-1 pb-2",
            showLabels ? "justify-between" : "justify-center"
          )}
        >
          <div className={cn("flex min-w-0 items-center gap-2.5", !showLabels && "justify-center")}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand-blue-700 text-[0.7rem] font-semibold text-white">
              {initials(currentUserName)}
            </span>
            {showLabels && (
              <p className="min-w-0 truncate text-xs text-sidebar-foreground/60">
                <span className="block truncate font-medium text-sidebar-foreground">{currentUserName}</span>
              </p>
            )}
          </div>
          {showLabels && <ThemeToggle />}
        </div>
        <button
          type="submit"
          title={showLabels ? undefined : "Sair"}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            !showLabels && "justify-center px-0"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {showLabels && "Sair"}
        </button>
      </form>
    );
  }

  return (
    <>
      {/* Topbar mobile */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </Button>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
          <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-4 w-auto" />
        </span>
        <p className="font-heading text-sm font-medium text-sidebar-foreground">Painel administrativo</p>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl">
            <div className="flex items-center justify-between">
              {renderHeader(true)}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="mr-3"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            {renderNav(true)}
            {renderFooter(true)}
          </aside>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div className="flex items-center">
          <div className="flex-1">{renderHeader(!collapsed)}</div>
        </div>
        {renderNav(!collapsed)}
        {renderFooter(!collapsed)}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex items-center justify-center gap-2 border-t border-sidebar-border py-2.5 text-xs font-medium text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Recolher"}
        </button>
      </aside>
    </>
  );
}
