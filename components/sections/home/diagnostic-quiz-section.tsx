"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { IconBadge } from "@/components/shared/icon-badge";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/shared/social-icons";
import { getSolutionIcon } from "@/components/sections/solucoes/solution-icons";
import { getSolutionBySlug } from "@/data/solutions";
import { buildWhatsappUrl } from "@/lib/site-config";

type Segment = { id: string; label: string; iconKey: string; slug: string };

const SEGMENTS: Segment[] = [
  { id: "varejo", label: "Loja física / comércio", iconKey: "ShoppingCart", slug: "pdv" },
  { id: "supermercado", label: "Supermercado", iconKey: "ShoppingBasket", slug: "supermercados" },
  { id: "ecommerce", label: "Loja virtual / e-commerce", iconKey: "Globe", slug: "lojas-virtuais" },
  { id: "restaurante", label: "Bar ou restaurante", iconKey: "UtensilsCrossed", slug: "bares-e-restaurantes" },
  { id: "hotel", label: "Hotel ou pousada", iconKey: "BedDouble", slug: "hoteis-e-pousadas" },
  { id: "oficina", label: "Oficina / auto center", iconKey: "Wrench", slug: "mecanica-auto-center" },
  { id: "servicos", label: "Prestação de serviços", iconKey: "ClipboardList", slug: "ordem-de-servico" },
  { id: "industria", label: "Indústria / produção", iconKey: "Factory", slug: "pcp" },
  { id: "distribuidora", label: "Distribuidora / atacado", iconKey: "TrendingUp", slug: "vendas-e-distribuicao" },
  { id: "construcao", label: "Construção / materiais", iconKey: "Hammer", slug: "materiais-de-construcao" },
  { id: "logistica", label: "Transporte e logística", iconKey: "Truck", slug: "transportes-e-logistica" },
  { id: "petshop", label: "Pet shop", iconKey: "PawPrint", slug: "pet-shop" },
  { id: "cobranca", label: "Cobrança / recuperação de crédito", iconKey: "Banknote", slug: "cobranca" },
];

type Need = { id: string; label: string; overrideSlug?: string };

const NEEDS: Need[] = [
  { id: "manter", label: "O segmento que escolhi já resume bem meu problema" },
  { id: "financeiro", label: "Minha dor é mais financeira, quero uma gestão completa", overrideSlug: "erp" },
  { id: "ponto", label: "Preciso controlar ponto e jornada da equipe", overrideSlug: "secullum-ponto" },
  { id: "crm", label: "Preciso vender mais e organizar meus clientes", overrideSlug: "crm" },
];

type Step = "segment" | "need" | "result";

export function DiagnosticQuizSection() {
  const [step, setStep] = useState<Step>("segment");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleSegment(s: Segment) {
    setSegment(s);
    setStep("need");
  }

  function handleNeed(n: Need) {
    setResultSlug(n.overrideSlug ?? segment?.slug ?? "erp");
    setStep("result");
  }

  function reset() {
    setSegment(null);
    setResultSlug(null);
    setStep("segment");
  }

  const result = resultSlug ? getSolutionBySlug(resultSlug) : undefined;
  const ResultIcon = result ? getSolutionIcon(result.iconKey) : Sparkles;

  const variants = {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 },
  };

  return (
    <section className="section-dark py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Diagnóstico rápido"
          title="Descubra o sistema ideal para o seu negócio"
          description="Responda 2 perguntas rápidas e a gente te mostra qual solução se encaixa melhor na sua rotina."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            {["segment", "need", "result"].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s
                    ? "w-8 bg-primary"
                    : ["segment", "need", "result"].indexOf(step) > ["segment", "need", "result"].indexOf(s)
                      ? "w-1.5 bg-primary/50"
                      : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === "segment" && (
                <motion.div
                  key="segment"
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-xl font-medium">
                    Qual desses melhor descreve o seu negócio?
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {SEGMENTS.map((s) => {
                      const Icon = getSolutionIcon(s.iconKey);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSegment(s)}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          <IconBadge icon={Icon} className="size-9 shrink-0 bg-primary/10" iconClassName="size-4" />
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === "need" && segment && (
                <motion.div
                  key="need"
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-xl font-medium">
                    O que mais pesa no seu dia a dia hoje?
                  </h3>
                  <div className="mt-6 space-y-3">
                    {NEEDS.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNeed(n)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        {n.label}
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                    Voltar
                  </button>
                </motion.div>
              )}

              {step === "result" && result && (
                <motion.div
                  key="result"
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="flex justify-center">
                    <IconBadge icon={ResultIcon} className="size-14 bg-primary/15" iconClassName="size-6" />
                  </div>
                  <p className="mt-4 text-sm font-medium uppercase tracking-wide text-primary">
                    Recomendamos
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-medium">{result.name}</h3>
                  <p className="mx-auto mt-3 max-w-md text-muted-foreground text-pretty">
                    {result.shortDescription}
                  </p>

                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button size="lg" nativeButton={false} render={<Link href={`/solucoes/${result.slug}`} />}>
                      Ver solução completa
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <a
                          href={buildWhatsappUrl(`Olá! Fiz o diagnóstico no site e recomendaram ${result.name} pra mim.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <WhatsappIcon className="size-4" />
                      Falar com a gente
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={reset}
                    className="mx-auto mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                    Refazer diagnóstico
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
