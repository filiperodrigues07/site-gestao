import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/hero-section";
import { PromotionsCarousel } from "@/components/sections/home/promotions-carousel";
import { AboutSection } from "@/components/sections/home/about-section";
import { SolutionsSection } from "@/components/sections/home/solutions-section";
import { DifferentiatorsSection } from "@/components/sections/home/differentiators-section";
import { CTASection } from "@/components/sections/home/cta-section";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sistemas de Gestão Empresarial e Automação Comercial",
  description:
    "Soluções completas em gestão empresarial e automação comercial: implantação, treinamento, suporte e consultoria especializada para o seu negócio.",
};

export default async function Home() {
  const promotions = await db.query.promotions.findMany({
    orderBy: (p, { asc }) => asc(p.createdAt),
  });

  return (
    <>
      <HeroSection />
      <PromotionsCarousel promotions={promotions} />
      <AboutSection />
      <SolutionsSection />
      <DifferentiatorsSection />
      <CTASection />
    </>
  );
}
