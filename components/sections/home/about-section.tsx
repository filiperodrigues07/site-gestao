import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { ShieldCheck, Cpu, Award, Users2 } from "lucide-react";

const stats = [
  { label: "Anos de experiência", value: "15+" },
  { label: "Empresas atendidas", value: "500+" },
  { label: "Segmentos de mercado", value: "15" },
  { label: "Satisfação de clientes", value: "98%" },
];

const pillars = [
  {
    icon: Cpu,
    title: "Tecnologia",
    description:
      "Plataformas modernas, estáveis e em constante evolução para acompanhar o ritmo do seu negócio.",
  },
  {
    icon: Award,
    title: "Experiência",
    description:
      "Anos de implantação em diferentes segmentos, do pequeno varejo à indústria.",
  },
  {
    icon: ShieldCheck,
    title: "Confiabilidade",
    description:
      "Conformidade fiscal e operações estáveis, com histórico comprovado de entregas.",
  },
  {
    icon: Users2,
    title: "Compromisso",
    description:
      "Relacionamento de longo prazo — acompanhamos o crescimento da sua empresa lado a lado.",
  },
];

export function AboutSection() {
  return (
    <section className="section-alt py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Sobre a Gestão"
          title="Inovação e confiabilidade para a gestão do seu negócio"
          description="Somos especialistas em implantar, treinar e dar suporte a sistemas de gestão empresarial — unindo tecnologia de ponta a um atendimento próximo e humano."
        />

        <RevealGroup className="mt-14 grid grid-cols-2 gap-8 border-y border-border py-10 md:grid-cols-4" stagger={0.08}>
          {stats.map((stat) => (
            <Reveal key={stat.label} className="text-center md:text-left">
              <p className="font-heading text-4xl font-medium text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {pillars.map((pillar) => (
            <Reveal key={pillar.title}>
              <pillar.icon className="size-6 text-primary" strokeWidth={1.75} />
              <h3 className="mt-4 font-heading text-lg font-medium">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
