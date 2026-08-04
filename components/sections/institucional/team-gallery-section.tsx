"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { teamPhotos } from "@/data/team-photos";

export function TeamGallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 320) + 20;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section className="section-alt py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-sm font-medium uppercase tracking-wide text-primary">
                Nossa equipe
              </span>
              <h2 className="mt-3 font-heading text-display-2 font-medium text-balance">
                Os bastidores da Gestão Consultorias
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Foto anterior"
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Próxima foto"
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {teamPhotos.map((photo) => (
            <div
              key={photo.id}
              data-card
              className="relative flex aspect-[4/5] w-64 shrink-0 snap-start items-center justify-center overflow-hidden rounded-2xl bg-[#0A0A0B] sm:w-72"
            >
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 288px, 256px"
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900 via-transparent to-transparent opacity-70" />
                  <div className="relative flex flex-col items-center gap-3 px-4 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
                      <Camera className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm text-white/70">{photo.alt}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
