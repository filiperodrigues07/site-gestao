import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SolutionsGrid } from "@/components/sections/solucoes/solutions-grid";
import { Reveal } from "@/components/motion/reveal";
import { solutions } from "@/data/solutions";

export function SolutionsSection() {
  return (
    <section className="section-alt py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Soluções"
          title="Um sistema para cada tipo de operação"
          description="Revendemos e implantamos soluções especializadas para os principais segmentos do mercado, todas integradas em um único ecossistema de gestão."
        />

        <div className="mt-14">
          <SolutionsGrid solutions={solutions} />
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Ver todas as soluções
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
