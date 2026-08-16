import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { IconBadge } from "@/components/shared/icon-badge";
import { differentiators } from "@/data/differentiators";
import { getDifferentiatorIcon } from "./differentiator-icons";

export function DifferentiatorsSection() {
  return (
    <section className="section-dark py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Diferenciais"
          title="Muito além da venda do sistema"
          description="Acompanhamos sua empresa em todas as etapas: da implantação ao suporte contínuo, com processos pensados para reduzir fricção no seu dia a dia."
        />

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {differentiators.map((item) => {
            const Icon = getDifferentiatorIcon(item.iconKey);
            return (
              <Reveal key={item.id} className="rounded-2xl border border-border bg-foreground/[0.03] p-6">
                <IconBadge icon={Icon} className="bg-primary/15" />
                <h3 className="mt-5 font-heading text-lg font-medium">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
