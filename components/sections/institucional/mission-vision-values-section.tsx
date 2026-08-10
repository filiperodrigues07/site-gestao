import {
  Target,
  Eye,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Zap,
  Award,
  Handshake,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";

const missionVision = [
  {
    id: "missao",
    icon: Target,
    title: "Missão",
    description:
      "Oferecer soluções em consultoria e automação para sistemas ERP de varejo, garantindo suporte ágil, eficiente e seguro, com foco em melhorar a gestão, produtividade e resultados dos nossos clientes.",
  },
  {
    id: "visao",
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência em suporte e automação de sistemas ERP no varejo, reconhecida pela inovação, confiabilidade e excelência no atendimento em todo o Brasil.",
  },
];

const values = [
  {
    icon: HeartHandshake,
    title: "Compromisso com o cliente",
    description: "Foco em entender e resolver as necessidades de cada negócio.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    description: "Busca constante por soluções tecnológicas modernas e eficazes.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência",
    description: "Atuação ética e clara em todos os processos.",
  },
  {
    icon: Zap,
    title: "Agilidade",
    description: "Respostas rápidas e soluções práticas.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Qualidade em cada atendimento e projeto.",
  },
  {
    icon: Handshake,
    title: "Parceria",
    description: "Relacionamento de confiança e longo prazo com clientes e parceiros.",
  },
];

export function MissionVisionValuesSection() {
  return (
    <section id="missao-visao-valores" className="section-dark scroll-mt-24 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Nossos princípios"
          title="Missão, visão e valores"
          description="Os princípios que guiam cada atendimento, implantação e parceria que construímos."
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.1}>
          {missionVision.map((item) => (
            <Reveal
              key={item.id}
              id={item.id}
              as="div"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <item.icon className="size-7 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-xl font-medium">{item.title}</h3>
              <p className="mt-3 text-muted-foreground text-pretty">{item.description}</p>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal id="valores" as="div" className="scroll-mt-24 mt-16">
          <h3 className="font-heading text-2xl font-medium">Valores</h3>
        </Reveal>
        <RevealGroup
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {values.map((value) => (
            <Reveal
              key={value.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <value.icon className="size-6 text-primary" strokeWidth={1.5} />
              <h4 className="mt-4 font-heading text-base font-medium">{value.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                {value.description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
