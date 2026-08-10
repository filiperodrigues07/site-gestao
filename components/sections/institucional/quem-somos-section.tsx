import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { TechGridBackground } from "@/components/shared/tech-grid-background";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { slideInLeft, slideInRight } from "@/components/motion/motion-tokens";

const stats = [
  { value: "15+", label: "Anos de experiência" },
  { value: "500+", label: "Empresas atendidas" },
  { value: "15", label: "Segmentos atendidos" },
  { value: "98%", label: "Satisfação de clientes" },
];

export function QuemSomosSection() {
  return (
    <section
      id="quem-somos"
      className="section-alt relative isolate scroll-mt-24 overflow-hidden py-20 md:py-28"
    >
      <TechGridBackground />
      <Image
        src="/brand/icon.png"
        alt=""
        aria-hidden
        width={298}
        height={244}
        className="pointer-events-none absolute -top-10 -right-24 -z-10 w-[420px] max-w-none opacity-[0.05] select-none md:w-[560px]"
      />

      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal variant={slideInLeft}>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/icon.png"
                alt=""
                width={298}
                height={244}
                className="h-9 w-auto"
              />
              <span className="text-sm font-medium uppercase tracking-wide text-primary">
                Quem somos
              </span>
            </div>
            <h1 className="mt-4 font-heading text-display-2 font-medium text-balance">
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

          <Reveal variant={slideInRight}>
            <PhotoLightbox
              src="/team/equipe.jpg"
              alt="Equipe Gestão Consultorias"
              width={1600}
              height={1067}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0A0A0B] ring-1 ring-white/10">
                <Image
                  src="/team/equipe.jpg"
                  alt="Equipe Gestão Consultorias"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </PhotoLightbox>

            <RevealGroup className="mt-5 grid grid-cols-2 gap-4" stagger={0.08}>
              {stats.map((item) => (
                <Reveal
                  key={item.label}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <p className="font-heading text-2xl font-medium text-primary">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </Reveal>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
