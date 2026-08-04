import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { slideInLeft, slideInRight } from "@/components/motion/motion-tokens";

export function QuemSomosSection() {
  return (
    <section id="quem-somos" className="section-alt scroll-mt-24 py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal variant={slideInLeft}>
            <span className="text-sm font-medium uppercase tracking-wide text-primary">
              Quem somos
            </span>
            <h1 className="mt-3 font-heading text-display-2 font-medium text-balance">
              Uma empresa moderna dedicada à gestão do seu negócio
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              A Gestão Consultorias & Sistemas Integrados nasceu para simplificar
              a vida de empresários que precisam de mais controle e menos
              retrabalho. Somos especialistas em implantação, treinamento,
              suporte e consultoria para softwares de gestão empresarial —
              acompanhando cada cliente do primeiro contato à evolução contínua
              da operação.
            </p>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Atuamos como revenda e implantadora oficial de soluções
              reconhecidas no mercado, unindo tecnologia de ponta a um
              atendimento próximo, humano e verdadeiramente consultivo.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-2 gap-5" stagger={0.08}>
            {[
              { value: "15+", label: "Anos de experiência" },
              { value: "500+", label: "Empresas atendidas" },
              { value: "15", label: "Segmentos atendidos" },
              { value: "98%", label: "Satisfação de clientes" },
            ].map((item) => (
              <Reveal
                key={item.label}
                variant={slideInRight}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="font-heading text-3xl font-medium text-primary">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
