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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artigos", label: "Artigos", icon: FileText },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/videos", label: "Vídeos", icon: Video },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
] as const;

export function SidebarNav({ currentUserName }: { currentUserName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="p-6">
        <p className="font-heading text-sm font-medium">Painel administrativo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Base de Conhecimento</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
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
