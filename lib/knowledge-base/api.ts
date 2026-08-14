import { NextRequest, NextResponse } from "next/server";
import type { Article, Category } from "@/lib/db/schema";

// Autenticação e helpers compartilhados pela API de artigos consumida por
// sistemas externos (ex.: RT HELPDESK) via header X-API-Key.

export function requireApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.KB_API_KEY || apiKey !== process.env.KB_API_KEY) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }
  return null;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gestaoconsultorias.fly.dev").replace(/\/$/, "");
}

const DIACRITICS_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g');

export function slugify(input: string): string {
  const slug = input
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return slug || "artigo";
}

export function serializeArticle(article: Article & { category?: Category | null }, base: string) {
  return {
    id: article.slug,
    title: article.title,
    summary: article.excerpt,
    content: article.content,
    status: article.status,
    categoryId: article.categoryId,
    category: article.category?.name,
    tags: article.tags,
    url: `${base}/base-de-conhecimento/artigos/${article.slug}`,
    updatedAt: article.updatedAt,
  };
}
