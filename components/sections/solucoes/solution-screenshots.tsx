"use client";

import { useRef, type PointerEvent } from "react";
import { Container } from "@/components/shared/container";
import { SimpleLightbox } from "@/components/shared/simple-lightbox";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Solution } from "@/data/solutions";

type DragState = { isDown: boolean; startX: number; scrollLeft: number; moved: boolean };

export function SolutionScreenshots({ solution }: { solution: Solution }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState>({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || e.pointerType !== "mouse") return;
    // Não captura o ponteiro aqui: um clique comum (sem arrastar) precisa
    // continuar dando o "click" nativo no botão da imagem. Só capturamos
    // quando um arrasto de verdade é detectado, em onPointerMove.
    dragState.current = { isDown: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || !dragState.current.isDown) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4 && !dragState.current.moved) {
      dragState.current.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    if (dragState.current.moved) {
      el.scrollLeft = dragState.current.scrollLeft - dx;
    }
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    dragState.current.isDown = false;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }

  function wasDragging() {
    return dragState.current.moved;
  }

  const screenshots = solution.screenshots;
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  if (screenshots.length === 1) {
    return (
      <section className="py-16 md:py-20">
        <Container>
          <Reveal className="relative mx-auto max-w-3xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 aspect-square -translate-y-1/2 rounded-full bg-brand-blue-600/20 blur-[100px]"
            />
            <SimpleLightbox src={screenshots[0]} alt={`Tela do ${solution.name}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshots[0]}
                alt={`Tela do ${solution.name}`}
                className="h-auto w-full rounded-2xl"
              />
            </SimpleLightbox>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-2 active:cursor-grabbing"
        >
          <RevealGroup className="contents" stagger={0.05}>
            {screenshots.map((src) => (
              <Reveal key={src} className="w-[220px] shrink-0 snap-start sm:w-[260px]">
                <SimpleLightbox src={src} alt={`Tela do ${solution.name}`} suppressClick={wasDragging}>
                  <div className="overflow-hidden rounded-[2rem] border-4 border-white/10 bg-black shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Tela do ${solution.name}`}
                      draggable={false}
                      className="h-auto w-full select-none"
                    />
                  </div>
                </SimpleLightbox>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
