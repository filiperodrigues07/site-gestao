import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllSolutionSlugs } from "@/data/solutions";
import { kbArticles } from "@/data/knowledge-base/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/solucoes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/institucional`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/base-de-conhecimento`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = getAllSolutionSlugs().map((slug) => ({
    url: `${baseUrl}/solucoes/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = kbArticles.map((article) => ({
    url: `${baseUrl}/base-de-conhecimento/artigos/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...solutionRoutes, ...articleRoutes];
}
