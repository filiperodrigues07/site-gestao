import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { articles, categories } from "@/lib/db/schema";
import { requireApiKey, serializeArticle, siteUrl } from "@/lib/knowledge-base/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.slug, slug), with: { category: true } });
  if (!article) {
    return NextResponse.json({ success: false, error: "Artigo não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: serializeArticle(article, siteUrl()) });
}

const updateSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  summary: z.string().trim().min(5).max(300).optional(),
  content: z.string().trim().min(10).optional(),
  categoryId: z.number().int().positive().optional(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const existing = await db.query.articles.findFirst({ where: eq(articles.slug, slug) });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Artigo não encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
  }

  if (parsed.data.categoryId !== undefined) {
    const category = await db.query.categories.findFirst({ where: eq(categories.id, parsed.data.categoryId) });
    if (!category) {
      return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 400 });
    }
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.summary !== undefined) updateData.excerpt = parsed.data.summary;
  if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
  if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;

  const [updated] = await db.update(articles).set(updateData).where(eq(articles.id, existing.id)).returning();
  const category = await db.query.categories.findFirst({ where: eq(categories.id, updated.categoryId) });

  revalidatePath("/base-de-conhecimento");
  revalidatePath(`/base-de-conhecimento/artigos/${slug}`);
  if (slug !== updated.slug) revalidatePath(`/base-de-conhecimento/artigos/${updated.slug}`);

  return NextResponse.json({ success: true, data: serializeArticle({ ...updated, category }, siteUrl()) });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const existing = await db.query.articles.findFirst({ where: eq(articles.slug, slug) });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Artigo não encontrado" }, { status: 404 });
  }

  await db.delete(articles).where(eq(articles.id, existing.id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath(`/base-de-conhecimento/artigos/${slug}`);

  return NextResponse.json({ success: true, data: { success: true } });
}
