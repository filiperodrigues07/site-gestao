import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contato/contact-form";
import { ContactInfoCard } from "@/components/sections/contato/contact-info-card";
import { BusinessHoursList } from "@/components/sections/contato/business-hours-list";
import { MapEmbed } from "@/components/sections/contato/map-embed";
import { getSolutionBySlug } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Gestão Consultorias & Sistemas Integrados: solicite uma demonstração ou tire suas dúvidas com nosso time.",
};

export default async function ContatoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; solucao?: string }>;
}) {
  const { tipo, solucao } = await searchParams;
  const defaultType = tipo === "demo" ? "demo" : "contato";
  const solution = solucao ? getSolutionBySlug(solucao) : undefined;

  return (
    <section className="section-alt pt-20 pb-24 md:pt-28 md:pb-32">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Contato"
          title={
            defaultType === "demo"
              ? "Solicite sua demonstração"
              : "Vamos conversar sobre o seu negócio"
          }
          description={
            solution
              ? `Preencha o formulário e nosso time entrará em contato para apresentar a solução de ${solution.name}.`
              : "Preencha o formulário, ligue ou fale pelo WhatsApp — nosso time responde rapidamente."
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={0.05} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm
              defaultType={defaultType}
              defaultSolutionInterest={solution?.name}
            />
          </Reveal>

          <div className="space-y-10">
            <Reveal delay={0.1}>
              <ContactInfoCard />
            </Reveal>
            <Reveal delay={0.15}>
              <BusinessHoursList />
            </Reveal>
            <Reveal delay={0.2}>
              <MapEmbed />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
