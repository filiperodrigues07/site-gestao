"use server";

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { articleSchema, type ArticleFormValues } from "@/lib/validations/admin/article-schema";
import { slugify } from "@/lib/knowledge-base/api";

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
  const user = await requirePermission("artigos");
  const parsed = articleSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  // Artigos sem autor (ex.: importados via API) passam a ficar atribuídos a
  // quem primeiro os editar pelo admin. Um artigo que já tem autor mantém o
  // autor original — editar não deve "roubar" a autoria de outra pessoa.
  const existing = await db.query.articles.findFirst({ where: eq(articles.id, id) });

  try {
    await db
      .update(articles)
      .set({
        ...parsed.data,
        tags: splitTags(parsed.data.tags),
        updatedAt: new Date().toISOString(),
        ...(existing?.authorId ? {} : { authorId: user.id }),
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

const IMPORT_FETCH_TIMEOUT_MS = 15_000;
const IMPORT_MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug;
  let suffix = 2;
  while (await db.query.articles.findFirst({ where: eq(articles.slug, candidate) })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export type ImportarArtigoDeUrlResult =
  | { title: string; slug: string; excerpt: string; content: string }
  | { error: string };

// Busca uma página externa, extrai o conteúdo principal (modo leitura, igual
// navegadores) e converte pra markdown — mesma ideia da importação por URL
// que já existe no RT HELPDESK. Só devolve os campos pra revisão no
// formulário; não salva nada sozinho.
export async function importarArtigoDeUrlAction(url: string): Promise<ImportarArtigoDeUrlResult> {
  await requirePermission("artigos");

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { error: "Informe uma URL válida (ex: https://exemplo.com/artigo)" };
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return { error: "Só URLs http:// ou https:// são suportadas" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMPORT_FETCH_TIMEOUT_MS);

  let html: string;
  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GestaoBot/1.0; +https://gestaoconsultorias.com.br)",
        Accept: "text/html",
      },
    });
    if (!response.ok) {
      return { error: `A página respondeu com erro ${response.status}.` };
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return { error: "Esse link não parece apontar para uma página HTML." };
    }
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > IMPORT_MAX_RESPONSE_BYTES) {
      return { error: "A página é grande demais para importar." };
    }
    html = new TextDecoder("utf-8").decode(buffer);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return {
      error: isTimeout ? "A página demorou demais para responder." : "Não foi possível acessar essa URL.",
    };
  } finally {
    clearTimeout(timeout);
  }

  try {
    const dom = new JSDOM(html, { url: parsedUrl.toString() });
    const parsed = new Readability(dom.window.document).parse();
    if (!parsed || !parsed.content) {
      return { error: "Não foi possível extrair o conteúdo dessa página." };
    }

    const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
    const content = turndown.turndown(parsed.content).trim();
    const title = (parsed.title || "Artigo importado").trim().slice(0, 160);
    const excerptSource = parsed.excerpt || parsed.textContent || "";
    const excerpt = excerptSource.trim().replace(/\s+/g, " ").slice(0, 300) || title;
    const slug = await ensureUniqueSlug(slugify(title));

    return {
      title,
      slug,
      excerpt,
      content: content || "*Conteúdo não pôde ser extraído automaticamente — cole manualmente aqui.*",
    };
  } catch {
    return { error: "Não foi possível processar o conteúdo dessa página." };
  }
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
