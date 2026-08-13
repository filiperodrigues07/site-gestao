import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sql } from "drizzle-orm";
import {
  FileText,
  Download,
  FolderOpen,
  HelpCircle,
  Video,
  Megaphone,
  Newspaper,
} from "lucide-react";
import { IconBadge } from "@/components/shared/icon-badge";
import { InstagramIcon } from "@/components/shared/social-icons";
import { getCurrentUser } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import {
  articles,
  downloads,
  categories,
  faqs,
  videos,
  promotions,
  updates,
  instagramPosts,
} from "@/lib/db/schema";

const SECTIONS = [
  { href: "/admin/artigos", label: "Artigos", icon: FileText, table: articles, section: "artigos" },
  { href: "/admin/downloads", label: "Downloads", icon: Download, table: downloads, section: "downloads" },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen, table: categories, section: "categorias" },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, table: faqs, section: "faq" },
  { href: "/admin/videos", label: "Vídeos", icon: Video, table: videos, section: "videos" },
  { href: "/admin/promocoes", label: "Promoções", icon: Megaphone, table: promotions, section: "promocoes" },
  { href: "/admin/novidades", label: "Novidades", icon: Newspaper, table: updates, section: "novidades" },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramIcon, table: instagramPosts, section: "instagram" },
] as const;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const visibleSections = SECTIONS.filter((section) => hasPermission(user, section.section));
  const firstName = user.name.trim().split(/\s+/)[0];

  const counts = await Promise.all(
    visibleSections.map(async (section) => {
      const [row] = await db.select({ count: sql<number>`count(*)` }).from(section.table);
      return row.count;
    })
  );

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Olá, {firstName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Visão geral do conteúdo da Base de Conhecimento.
      </p>

      {visibleSections.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Você ainda não tem acesso a nenhuma tela. Peça a um administrador para liberar suas
          permissões em Usuários.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleSections.map((section, i) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between">
                <IconBadge icon={section.icon} className="bg-primary/10" />
                <ArrowRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-4 font-heading text-3xl font-medium">{counts[i]}</p>
              <p className="mt-1 text-sm text-muted-foreground">{section.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
