import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SolutionsGrid } from "./solutions-grid";
import type { Solution } from "@/data/solutions";

export function RelatedSolutions({ solutions }: { solutions: Solution[] }) {
  if (solutions.length === 0) return null;

  return (
    <section className="section-alt py-20 md:py-24">
      <Container>
        <SectionHeading eyebrow="Continue explorando" title="Outras soluções que podem te interessar" />
        <div className="mt-10">
          <SolutionsGrid solutions={solutions} />
        </div>
      </Container>
    </section>
  );
}
