import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";

async function getPublishedArticle(slug: string) {
  return db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.status, "published")),
    with: { category: true, author: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="section-alt pt-20 pb-24 md:pt-28 md:pb-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/base-de-conhecimento"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Base de Conhecimento
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-3">
            {article.category && <Badge variant="secondary">{article.category.name}</Badge>}
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              Atualizado em{" "}
              {new Date(article.updatedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            {article.author && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="size-3.5" />
                {article.author.name}
              </span>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-4 font-heading text-display-3 font-medium text-balance">
              {article.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="prose prose-invert mt-10 max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
