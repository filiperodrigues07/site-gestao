import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { RevealGroup } from "@/components/motion/reveal-group";
import type { Solution } from "@/data/solutions";

export function SolutionScreenshots({ solution }: { solution: Solution }) {
  const screenshots = solution.screenshots;
  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <Container>
        <RevealGroup className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2" stagger={0.05}>
          {screenshots.map((src) => (
            <Reveal key={src} className="w-[220px] shrink-0 snap-start sm:w-[260px]">
              <div className="overflow-hidden rounded-[2rem] border-4 border-white/10 bg-black shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Tela do ${solution.name}`} className="h-auto w-full" />
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
