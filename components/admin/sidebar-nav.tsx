"use client";

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
  LogOut,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";
import type { AdminSection } from "@/lib/auth/permissions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, section: null },
  { href: "/admin/artigos", label: "Artigos", icon: FileText, section: "artigos" },
  { href: "/admin/downloads", label: "Downloads", icon: Download, section: "downloads" },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen, section: "categorias" },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, section: "faq" },
  { href: "/admin/videos", label: "Vídeos", icon: Video, section: "videos" },
  { href: "/admin/promocoes", label: "Promoções", icon: Megaphone, section: "promocoes" },
  { href: "/admin/ranking", label: "Ranking", icon: Trophy, section: null },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, section: "admin-only" },
] satisfies { href: string; label: string; icon: typeof LayoutDashboard; section: AdminSection | "admin-only" | null }[];

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

  const items = NAV_ITEMS.filter((item) => {
    if (isAdmin) return true;
    if (item.section === null) return true;
    if (item.section === "admin-only") return false;
    return permissions.includes(item.section);
  });

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="p-6">
        <p className="font-heading text-sm font-medium">Painel administrativo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Base de Conhecimento</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/admin/senha"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/admin/senha"
              ? "bg-primary/10 text-primary"
              : "text-foreground/80 hover:bg-muted hover:text-foreground"
          )}
        >
          <KeyRound className="size-4" />
          Trocar senha
        </Link>
      </nav>
      <form action={logoutAction} className="border-t border-border p-3">
        <p className="px-3 pb-2 text-xs text-muted-foreground">
          Logado como <span className="font-medium text-foreground">{currentUserName}</span>
        </p>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </form>
    </aside>
  );
}
