import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/db/schema";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/base-de-conhecimento/artigos/${article.slug}`}>
      <Card className="group h-full border-border/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mt-4 font-heading text-lg font-medium">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {formatDate(article.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Ler artigo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
