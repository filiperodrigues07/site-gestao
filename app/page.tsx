import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/hero-section";
import { AboutSection } from "@/components/sections/home/about-section";
import { SolutionsSection } from "@/components/sections/home/solutions-section";
import { DifferentiatorsSection } from "@/components/sections/home/differentiators-section";
import { CTASection } from "@/components/sections/home/cta-section";

export const metadata: Metadata = {
  title: "Sistemas de Gestão Empresarial e Automação Comercial",
  description:
    "Soluções completas em gestão empresarial e automação comercial: implantação, treinamento, suporte e consultoria especializada para o seu negócio.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SolutionsSection />
      <DifferentiatorsSection />
      <CTASection />
    </>
  );
}
