import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSolutionSlugs,
  getSolutionBySlug,
  getRelatedSolutions,
} from "@/data/solutions";
import { SolutionHero } from "@/components/sections/solucoes/solution-hero";
import { SolutionFeatures } from "@/components/sections/solucoes/solution-features";
import { SolutionBenefits } from "@/components/sections/solucoes/solution-benefits";
import { RelatedSolutions } from "@/components/sections/solucoes/related-solutions";
import { CTASection } from "@/components/sections/home/cta-section";

export function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};

  return {
    title: solution.name,
    description: solution.shortDescription,
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const related = getRelatedSolutions(slug);

  return (
    <>
      <SolutionHero solution={solution} />
      <SolutionFeatures solution={solution} />
      <SolutionBenefits solution={solution} />
      <RelatedSolutions solutions={related} />
      <CTASection />
    </>
  );
}
