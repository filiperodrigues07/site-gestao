"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/shared/container";
import type { Promotion } from "@/lib/db/schema";

const AUTOPLAY_MS = 6000;

export function PromotionsCarousel({ promotions }: { promotions: Promotion[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (promotions.length < 2 || paused) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % promotions.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [promotions.length, paused]);

  if (promotions.length === 0) {
    return null;
  }

  const active = promotions[index];

  const Figure = (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0A0A0B] md:h-[560px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={active.id}
          src={`/api/promotions/${active.id}/image`}
          alt={active.title}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-full max-w-full object-contain"
        />
      </AnimatePresence>
    </div>
  );

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div
          className="group relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {active.linkUrl ? (
            <a
              href={active.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={active.title}
            >
              {Figure}
            </a>
          ) : (
            Figure
          )}

          {promotions.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {promotions.map((promotion, i) => (
                <button
                  key={promotion.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ver promoção ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
