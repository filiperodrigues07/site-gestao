import type { Metadata } from "next";
import { QuemSomosSection } from "@/components/sections/institucional/quem-somos-section";
import { MissionVisionValuesSection } from "@/components/sections/institucional/mission-vision-values-section";
import { TeamGallerySection } from "@/components/sections/institucional/team-gallery-section";
import { CTASection } from "@/components/sections/home/cta-section";

export const metadata: Metadata = {
  title: "Institucional",
  description:
    "Conheça a Gestão Consultorias & Sistemas Integrados: nossa missão, visão e valores como especialistas em sistemas de gestão empresarial.",
};

export default function InstitucionalPage() {
  return (
    <>
      <QuemSomosSection />
      <MissionVisionValuesSection />
      <TeamGallerySection />
      <CTASection />
    </>
  );
}
