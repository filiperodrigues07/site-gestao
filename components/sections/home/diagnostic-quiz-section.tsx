"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
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

type Size = { id: string; label: string; note: string };

const SIZES: Size[] = [
  {
    id: "pequena",
    label: "Só eu ou uma equipe pequena (até 5 pessoas)",
    note: "Ideal para times enxutos que precisam de agilidade no dia a dia, sem complicação.",
  },
  {
    id: "media",
    label: "Equipe média (6 a 20 pessoas)",
    note: "Pensado para operações em crescimento que já sentem falta de mais controle e organização.",
  },
  {
    id: "grande",
    label: "Empresa estruturada (mais de 20 pessoas)",
    note: "Preparado para a complexidade de operações maiores, com múltiplos setores e usuários.",
  },
];

type Step = "segment" | "need" | "size" | "result";

const STEPS: Step[] = ["segment", "need", "size", "result"];

function computeMatchScore(needOverridden: boolean, sizeChosen: boolean) {
  let score = 78;
  score += needOverridden ? 12 : 6;
  score += sizeChosen ? 7 : 0;
  return Math.min(score, 97);
}

export function DiagnosticQuizSection() {
  const [step, setStep] = useState<Step>("segment");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [need, setNeed] = useState<Need | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleSegment(s: Segment) {
    setSegment(s);
    setStep("need");
  }

  function handleNeed(n: Need) {
    setNeed(n);
    setStep("size");
  }

  function handleSize(sz: Size) {
    setSize(sz);
    setStep("result");
  }

  function reset() {
    setSegment(null);
    setNeed(null);
    setSize(null);
    setStep("segment");
  }

  const resultSlug = need?.overrideSlug ?? segment?.slug ?? "erp";
  const result = getSolutionBySlug(resultSlug);
  const ResultIcon = result ? getSolutionIcon(result.iconKey) : Sparkles;

  const secondarySlug =
    size && size.id !== "pequena" && resultSlug !== "secullum-ponto"
      ? "secullum-ponto"
      : resultSlug !== "crm"
        ? "crm"
        : "erp";
  const secondary = resultSlug !== secondarySlug ? getSolutionBySlug(secondarySlug) : undefined;
  const SecondaryIcon = secondary ? getSolutionIcon(secondary.iconKey) : Sparkles;

  const matchScore = computeMatchScore(Boolean(need?.overrideSlug), Boolean(size));
  const reasons = result?.features.slice(0, 3) ?? [];

  const variants = {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 },
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <section className="section-dark py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Diagnóstico rápido"
          title="Descubra o sistema ideal para o seu negócio"
          description="Responda 3 perguntas rápidas e a gente te mostra qual solução se encaixa melhor na sua rotina."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? "w-8 bg-primary" : i < stepIndex ? "w-1.5 bg-primary/50" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          {step !== "result" && (
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pergunta {stepIndex + 1} de 3
            </p>
          )}

          <div className="rounded-3xl border border-border bg-foreground/[0.03] p-6 md:p-10">
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
                    {SEGMENTS.map((s, i) => {
                      const Icon = getSolutionIcon(s.iconKey);
                      return (
                        <motion.button
                          key={s.id}
                          type="button"
                          onClick={() => handleSegment(s)}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          <IconBadge icon={Icon} className="size-9 shrink-0 bg-primary/10" iconClassName="size-4" />
                          {s.label}
                        </motion.button>
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
                    {NEEDS.map((n, i) => (
                      <motion.button
                        key={n.id}
                        type="button"
                        onClick={() => handleNeed(n)}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        {n.label}
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </motion.button>
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

              {step === "size" && segment && need && (
                <motion.div
                  key="size"
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-xl font-medium">
                    Qual o tamanho da sua equipe hoje?
                  </h3>
                  <div className="mt-6 space-y-3">
                    {SIZES.map((sz, i) => (
                      <motion.button
                        key={sz.id}
                        type="button"
                        onClick={() => handleSize(sz)}
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        {sz.label}
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("need")}
                    className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                    Voltar
                  </button>
                </motion.div>
              )}

              {step === "result" && result && size && (
                <motion.div
                  key="result"
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="flex justify-center">
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <IconBadge icon={ResultIcon} className="size-14 bg-primary/15" iconClassName="size-6" />
                    </motion.div>
                  </div>
                  <p className="mt-4 text-sm font-medium uppercase tracking-wide text-primary">
                    Recomendamos
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-medium">{result.name}</h3>
                  <p className="mx-auto mt-3 max-w-md text-muted-foreground text-pretty">
                    {result.shortDescription}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground/80 text-pretty">
                    {size.note}
                  </p>

                  <div className="mx-auto mt-6 max-w-xs">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      <span>Compatibilidade com seu perfil</span>
                      <span className="text-primary">{matchScore}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${matchScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                      />
                    </div>
                  </div>

                  {reasons.length > 0 && (
                    <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
                      {reasons.map((reason, i) => (
                        <motion.li
                          key={reason}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.3 + i * 0.08 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {reason}
                        </motion.li>
                      ))}
                    </ul>
                  )}

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

                  {secondary && (
                    <Link
                      href={`/solucoes/${secondary.slug}`}
                      className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-xl border border-border bg-foreground/[0.02] p-4 text-left text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <IconBadge icon={SecondaryIcon} className="size-10 shrink-0 bg-primary/10" iconClassName="size-4" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Também pode fazer sentido pra você</span>
                        <span className="font-medium">{secondary.name}</span>
                      </span>
                      <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  )}

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
