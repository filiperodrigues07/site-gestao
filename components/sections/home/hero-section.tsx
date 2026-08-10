"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { WhatsappIcon } from "@/components/shared/social-icons";
import { NotebookMockup } from "./notebook-mockup";
import { buildWhatsappUrl } from "@/lib/site-config";
import { DURATION, EASE_OUT, staggerContainer, fadeUp } from "@/components/motion/motion-tokens";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="section-alt relative isolate overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] bg-[radial-gradient(ellipse_at_top,var(--brand-blue-900),transparent_65%)] opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "show"}
            variants={staggerContainer(0.12)}
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
            >
              Gestão empresarial e automação comercial
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="mt-6 font-heading text-display-1 font-medium text-balance"
            >
              Sistemas de gestão que colocam sua empresa no controle
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
            >
              A Gestão Consultorias & Sistemas Integrados oferece soluções
              completas em gestão empresarial e automação comercial —
              implantação, treinamento, suporte e consultoria especializada
              para o seu negócio crescer com previsibilidade.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
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
                render={
                  <a href={buildWhatsappUrl()} target="_blank" rel="noopener noreferrer" />
                }
              >
                <WhatsappIcon className="size-4" />
                Falar no WhatsApp
              </Button>
            </motion.div>
          </motion.div>

          <NotebookMockup />
        </div>
      </Container>
    </section>
  );
}
