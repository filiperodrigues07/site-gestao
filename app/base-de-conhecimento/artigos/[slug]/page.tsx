import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { kbArticles, getArticleBySlug } from "@/data/knowledge-base/articles";
import { getCategoryBySlug } from "@/data/knowledge-base/categories";

export function generateStaticParams() {
  return kbArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
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
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.categorySlug);

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
            {category && <Badge variant="secondary">{category.name}</Badge>}
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="size-3.5" />
              Atualizado em{" "}
              {new Date(article.updatedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-4 font-heading text-display-3 font-medium text-balance">
              {article.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-headings:font-medium prose-a:text-primary">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
