import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { KnowledgeBaseExplorer } from "@/components/sections/knowledge-base/knowledge-base-explorer";
import { CategoryCard } from "@/components/sections/knowledge-base/category-card";
import { FAQAccordion } from "@/components/sections/knowledge-base/faq-accordion";
import { VideoGrid } from "@/components/sections/knowledge-base/video-grid";
import { DownloadsList } from "@/components/sections/knowledge-base/downloads-list";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { db } from "@/lib/db/client";
import { articles as articlesTable } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Base de Conhecimento",
  description:
    "Central de ajuda da Gestão: artigos, FAQ, vídeos e downloads para você aproveitar ao máximo o seu sistema.",
};

export default async function BaseDeConhecimentoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [kbCategories, kbArticles, faqs, kbVideos, kbDownloads] = await Promise.all([
    db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) }),
    db.query.articles.findMany({
      where: eq(articlesTable.status, "published"),
      orderBy: (a, { desc }) => desc(a.updatedAt),
      with: { category: true },
    }),
    db.query.faqs.findMany({ orderBy: (f, { asc }) => asc(f.id) }),
    db.query.videos.findMany({ orderBy: (v, { asc }) => asc(v.id) }),
    db.query.downloads.findMany({ orderBy: (d, { desc }) => desc(d.createdAt) }),
  ]);

  return (
    <>
      <section className="section-alt pt-20 pb-16 md:pt-28 md:pb-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Base de Conhecimento"
            title="Como podemos ajudar?"
            description="Artigos, tutoriais e respostas para as principais dúvidas sobre implantação, uso e configuração do sistema."
            align="center"
          />

          <RevealGroup
            className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
          >
            {kbCategories.map((category) => (
              <Reveal key={category.id}>
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </RevealGroup>

          <div id="artigos" className="mt-16 scroll-mt-24">
            <KnowledgeBaseExplorer
              categories={kbCategories}
              articles={kbArticles}
              initialCategory={categoria ?? null}
            />
          </div>
        </Container>
      </section>

      <section className="section-alt border-t border-border py-20 md:py-24">
        <Container>
          <SectionHeading eyebrow="Vídeos" title="Aprenda assistindo" align="center" />
          <div className="mx-auto mt-12 max-w-4xl">
            <VideoGrid videos={kbVideos} />
          </div>
        </Container>
      </section>

      <section className="section-dark py-20 md:py-24">
        <Container>
          <SectionHeading eyebrow="Downloads" title="Materiais para baixar" align="center" />
          <div className="mx-auto mt-12 max-w-3xl">
            <DownloadsList downloads={kbDownloads} />
          </div>
        </Container>
      </section>

      <section className="section-alt py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="Perguntas mais comuns"
            align="center"
          />
          <div className="mt-12">
            <FAQAccordion faqs={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
