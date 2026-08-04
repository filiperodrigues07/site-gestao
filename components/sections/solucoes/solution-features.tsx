import { Check } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Solution } from "@/data/solutions";

export function SolutionFeatures({ solution }: { solution: Solution }) {
  return (
    <section className="section-alt py-20 md:py-24">
      <Container>
        <SectionHeading eyebrow="Funcionalidades" title={`O que o ${solution.name} entrega`} />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.05}>
          {solution.features.map((feature) => (
            <Reveal
              key={feature}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <span className="text-sm">{feature}</span>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
