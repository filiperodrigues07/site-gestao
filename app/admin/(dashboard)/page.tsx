import Link from "next/link";
import { sql } from "drizzle-orm";
import { FileText, Download, FolderOpen, HelpCircle, Video, Megaphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { articles, downloads, categories, faqs, videos, promotions } from "@/lib/db/schema";

const SECTIONS = [
  { href: "/admin/artigos", label: "Artigos", icon: FileText, table: articles, section: "artigos" },
  { href: "/admin/downloads", label: "Downloads", icon: Download, table: downloads, section: "downloads" },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen, table: categories, section: "categorias" },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, table: faqs, section: "faq" },
  { href: "/admin/videos", label: "Vídeos", icon: Video, table: videos, section: "videos" },
  { href: "/admin/promocoes", label: "Promoções", icon: Megaphone, table: promotions, section: "promocoes" },
] as const;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const visibleSections = SECTIONS.filter((section) => hasPermission(user, section.section));

  const counts = await Promise.all(
    visibleSections.map(async (section) => {
      const [row] = await db.select({ count: sql<number>`count(*)` }).from(section.table);
      return row.count;
    })
  );

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Visão geral do conteúdo da Base de Conhecimento.
      </p>

      {visibleSections.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Você ainda não tem acesso a nenhuma tela. Peça a um administrador para liberar suas
          permissões em Usuários.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSections.map((section, i) => (
            <Link key={section.href} href={section.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="size-4 text-primary" />
                    {section.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-3xl font-medium">{counts[i]}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
