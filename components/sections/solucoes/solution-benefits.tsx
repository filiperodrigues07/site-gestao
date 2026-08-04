import { Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Solution } from "@/data/solutions";

export function SolutionBenefits({ solution }: { solution: Solution }) {
  return (
    <section className="section-dark py-20 md:py-24">
      <Container>
        <SectionHeading eyebrow="Benefícios" title="Resultados que você sente no dia a dia" />
        <RevealGroup
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {solution.benefits.map((benefit) => (
            <Reveal
              key={benefit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <Sparkles className="size-5 text-primary" strokeWidth={1.75} />
              <p className="mt-4 text-base font-medium">{benefit}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
