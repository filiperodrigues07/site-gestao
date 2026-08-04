"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "./article-card";
import { cn } from "@/lib/utils";
import type { KBCategory } from "@/data/knowledge-base/categories";
import type { KBArticle } from "@/data/knowledge-base/articles";

export function KnowledgeBaseExplorer({
  categories,
  articles,
  initialCategory = null,
}: {
  categories: KBCategory[];
  articles: KBArticle[];
  initialCategory?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        !activeCategory || article.categorySlug === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [article.title, article.excerpt, ...article.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [articles, query, activeCategory]);

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar artigos, guias e dúvidas..."
          className="h-12 rounded-full pl-11 text-base"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => setActiveCategory(null)}>
          <Badge
            variant={activeCategory === null ? "default" : "secondary"}
            className={cn("cursor-pointer px-3.5 py-1.5 text-sm")}
          >
            Todas
          </Badge>
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
          >
            <Badge
              variant={activeCategory === category.slug ? "default" : "secondary"}
              className="cursor-pointer px-3.5 py-1.5 text-sm"
            >
              {category.name}
            </Badge>
          </button>
        ))}
      </div>

      <div className="mt-12">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum artigo encontrado para essa busca.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
