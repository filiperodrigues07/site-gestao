import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { WhatsappIcon } from "@/components/shared/social-icons";
import { buildWhatsappUrl } from "@/lib/site-config";

export function CTASection() {
  return (
    <section className="section-alt py-24 md:py-32">
      <Container>
        {/* Bloco de destaque sempre escuro (efeito "spotlight"), independente do
            tema do site — escopa .dark localmente pra reaproveitar os tokens
            em vez de cor fixa, então continua fácil de manter. */}
        <Reveal className="dark relative overflow-hidden rounded-3xl border border-border bg-background bg-gradient-to-b from-foreground/[0.06] to-transparent px-8 py-16 text-center shadow-[0_0_120px_-20px_var(--brand-blue-600)] sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--brand-blue-900),transparent_70%)] opacity-80"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-heading text-display-3 font-medium text-foreground text-balance">
              Pronto para colocar sua gestão no piloto automático?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
              Fale com nosso time e veja na prática como a Gestão pode
              simplificar a operação da sua empresa.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/contato?tipo=demo" />}
              >
                Solicitar Demonstração
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                className="border-border bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground"
                render={
                  <a href={buildWhatsappUrl()} target="_blank" rel="noopener noreferrer" />
                }
              >
                <WhatsappIcon className="size-4" />
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
