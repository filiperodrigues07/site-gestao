import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechGridBackground } from "@/components/shared/tech-grid-background";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import { UpdateCard } from "./update-card";
import type { Update } from "@/lib/db/schema";

export function WeeklyUpdatesSection({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return null;
  }

  return (
    <section className="section-alt relative isolate overflow-hidden py-24 md:py-32">
      <TechGridBackground glow="none" />
      <Image
        src="/brand/partners/ch-sistemas.svg"
        alt=""
        aria-hidden
        width={241}
        height={89}
        className="pointer-events-none absolute -right-16 -bottom-14 -z-10 w-[520px] max-w-none opacity-[0.06] select-none md:w-[720px]"
      />

      <Container>
        <SectionHeading
          eyebrow="Novidades"
          title="Atualizações do sistema"
          description="Acompanhe o que mudou por último nas soluções que você usa no dia a dia. Clique em uma novidade para ver os detalhes."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {updates.map((update) => (
            <Reveal key={update.id} className="h-full">
              <UpdateCard update={update} />
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
