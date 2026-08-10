import Image from "next/image";
import { Camera } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { teamPhotos } from "@/data/team-photos";

function PhotoCard({ photo }: { photo: (typeof teamPhotos)[number] }) {
  const card = (
    <div className="relative flex aspect-[4/5] w-64 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0A0A0B] sm:w-72">
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
  );

  if (!photo.src) return card;

  return (
    <PhotoLightbox src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}>
      {card}
    </PhotoLightbox>
  );
}

export function TeamGallerySection() {
  return (
    <section className="section-alt py-20 md:py-28">
      <Container>
        <Reveal>
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Nossa equipe
          </span>
          <h2 className="mt-3 font-heading text-display-2 font-medium text-balance">
            Os bastidores da Gestão Consultorias
          </h2>
        </Reveal>
      </Container>

      <Reveal className="group mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...teamPhotos, ...teamPhotos].map((photo, i) => (
            <PhotoCard key={`${photo.id}-${i}`} photo={photo} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
