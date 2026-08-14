import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { articles, categories } from "@/lib/db/schema";
import { requireApiKey, serializeArticle, siteUrl, slugify } from "@/lib/knowledge-base/api";

// API de artigos para sistemas externos (ex.: RT HELPDESK) consultarem e
// gerenciarem a Base de Conhecimento. Protegida por header X-API-Key.
//
// GET sem "status" retorna só artigos publicados (uso público/leitura geral).
// GET com status=all|draft|published permite que uma tela de gestão externa
// veja também os rascunhos.

export async function GET(request: NextRequest) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const q = request.nextUrl.searchParams.get("q")?.trim();
  const status = request.nextUrl.searchParams.get("status");

  const conditions = [];
  if (status === "draft" || status === "published") {
    conditions.push(eq(articles.status, status));
  } else if (status !== "all") {
    conditions.push(eq(articles.status, "published"));
  }
  if (q) conditions.push(or(like(articles.title, `%${q}%`), like(articles.excerpt, `%${q}%`))!);

  const rows = await db.query.articles.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: (a) => desc(a.updatedAt),
    with: { category: true },
  });

  const base = siteUrl();
  return NextResponse.json({ success: true, data: rows.map((article) => serializeArticle(article, base)) });
}

async function findAvailableSlug(base: string): Promise<string> {
  let candidate = base;
  let suffix = 2;
  while (await db.query.articles.findFirst({ where: eq(articles.slug, candidate) })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

const createSchema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(5).max(300),
  content: z.string().trim().min(10),
  categoryId: z.number().int().positive(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
  }

  const category = await db.query.categories.findFirst({ where: eq(categories.id, parsed.data.categoryId) });
  if (!category) {
    return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 400 });
  }

  const slug = await findAvailableSlug(slugify(parsed.data.title));

  const [created] = await db
    .insert(articles)
    .values({
      slug,
      title: parsed.data.title,
      excerpt: parsed.data.summary,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      tags: parsed.data.tags,
      status: parsed.data.status,
    })
    .returning();

  revalidatePath("/base-de-conhecimento");

  return NextResponse.json(
    { success: true, data: serializeArticle({ ...created, category }, siteUrl()) },
    { status: 201 },
  );
}
