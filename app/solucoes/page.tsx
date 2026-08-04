import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SolutionsGrid } from "@/components/sections/solucoes/solutions-grid";
import { CTASection } from "@/components/sections/home/cta-section";
import { solutions } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Soluções",
  description:
    "Conheça as soluções que a Gestão revende e implanta para os principais segmentos do mercado: ERP, PDV, CRM e muito mais.",
};

export default function SolucoesPage() {
  return (
    <>
      <section className="section-alt pt-20 pb-20 md:pt-28 md:pb-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Soluções"
            title="Sistemas especializados para o seu segmento"
            description="Revendemos e implantamos soluções completas para 15 segmentos de mercado, todas integradas em um único ecossistema de gestão empresarial."
            align="center"
          />
          <div className="mt-14">
            <SolutionsGrid solutions={solutions} variant="detailed" />
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
