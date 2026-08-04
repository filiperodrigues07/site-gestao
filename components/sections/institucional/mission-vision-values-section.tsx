import { Target, Eye, Gem } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";

const items = [
  {
    id: "missao",
    icon: Target,
    title: "Missão",
    description:
      "Simplificar a gestão empresarial por meio de tecnologia, consultoria especializada e um relacionamento próximo com cada cliente.",
  },
  {
    id: "visao",
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência em implantação e suporte de sistemas de gestão, reconhecida pela qualidade do atendimento e pelos resultados entregues.",
  },
  {
    id: "valores",
    icon: Gem,
    title: "Valores",
    description:
      "Transparência, compromisso com o resultado do cliente, excelência técnica e evolução constante.",
  },
];

export function MissionVisionValuesSection() {
  return (
    <section className="section-dark py-20 md:py-28">
      <Container>
        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.1}>
          {items.map((item) => (
            <Reveal
              key={item.id}
              id={item.id}
              as="div"
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <item.icon className="size-7 text-primary" strokeWidth={1.5} />
              <h2 className="mt-5 font-heading text-xl font-medium">
                {item.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                {item.description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
