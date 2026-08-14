import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, like, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";

// API pública de leitura para sistemas externos (ex.: RT HELPDESK) consultarem
// os artigos publicados da Base de Conhecimento. Protegida por uma chave de
// API compartilhada — não expõe rascunhos (status "draft").

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gestaoconsultorias.fly.dev").replace(/\/$/, "");
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.KB_API_KEY || apiKey !== process.env.KB_API_KEY) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();

  const conditions = [eq(articles.status, "published")];
  if (q) conditions.push(or(like(articles.title, `%${q}%`), like(articles.excerpt, `%${q}%`))!);

  const rows = await db.query.articles.findMany({
    where: and(...conditions),
    orderBy: (a) => desc(a.updatedAt),
    with: { category: true },
  });

  const base = siteUrl();
  const data = rows.map((article) => ({
    id: article.slug,
    title: article.title,
    summary: article.excerpt,
    url: `${base}/base-de-conhecimento/artigos/${article.slug}`,
    category: article.category?.name,
    updatedAt: article.updatedAt,
  }));

  return NextResponse.json({ success: true, data });
}
