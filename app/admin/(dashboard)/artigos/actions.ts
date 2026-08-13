"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { articleSchema, type ArticleFormValues } from "@/lib/validations/admin/article-schema";

function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createArticle(values: ArticleFormValues) {
  const user = await requirePermission("artigos");
  const parsed = articleSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db.insert(articles).values({
      ...parsed.data,
      tags: splitTags(parsed.data.tags),
      authorId: user.id,
    });
  } catch {
    return { error: "Já existe um artigo com esse slug" };
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/artigos");
  redirect("/admin/artigos");
}

export async function updateArticle(id: number, previousSlug: string, values: ArticleFormValues) {
  await requirePermission("artigos");
  const parsed = articleSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db
      .update(articles)
      .set({
        ...parsed.data,
        tags: splitTags(parsed.data.tags),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(articles.id, id));
  } catch {
    return { error: "Já existe um artigo com esse slug" };
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath(`/base-de-conhecimento/artigos/${previousSlug}`);
  if (previousSlug !== parsed.data.slug) {
    revalidatePath(`/base-de-conhecimento/artigos/${parsed.data.slug}`);
  }
  revalidatePath("/admin/artigos");
  redirect("/admin/artigos");
}

export async function deleteArticle(id: number, slug: string) {
  await requirePermission("artigos");
  await db.delete(articles).where(eq(articles.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath(`/base-de-conhecimento/artigos/${slug}`);
  revalidatePath("/admin/artigos");
  return {};
}

async function findAvailableSlug(baseSlug: string): Promise<string> {
  let candidate = `${baseSlug}-copia`;
  let suffix = 2;
  while (await db.query.articles.findFirst({ where: eq(articles.slug, candidate) })) {
    candidate = `${baseSlug}-copia-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function duplicateArticle(id: number) {
  const user = await requirePermission("artigos");
  const source = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!source) return { error: "Artigo não encontrado" };

  const slug = await findAvailableSlug(source.slug);

  const [copy] = await db
    .insert(articles)
    .values({
      slug,
      title: `${source.title} (cópia)`,
      excerpt: source.excerpt,
      content: source.content,
      categoryId: source.categoryId,
      tags: source.tags,
      status: "draft",
      authorId: user.id,
    })
    .returning();

  revalidatePath("/admin/artigos");
  redirect(`/admin/artigos/${copy.id}`);
}
