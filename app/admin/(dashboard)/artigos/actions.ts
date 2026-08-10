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
