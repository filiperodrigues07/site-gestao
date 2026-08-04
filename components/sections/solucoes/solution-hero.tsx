import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { IconBadge } from "@/components/shared/icon-badge";
import { Reveal } from "@/components/motion/reveal";
import { getSolutionIcon } from "./solution-icons";
import type { Solution } from "@/data/solutions";

export function SolutionHero({ solution }: { solution: Solution }) {
  const Icon = getSolutionIcon(solution.iconKey);

  return (
    <section className="section-alt pt-20 pb-16 md:pt-28 md:pb-20">
      <Container>
        <Reveal>
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Todas as soluções
          </Link>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal delay={0.05}>
              <IconBadge icon={Icon} className="size-14 rounded-2xl" iconClassName="size-6" />
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-heading text-display-2 font-medium text-balance">
                {solution.name}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
                {solution.longDescription}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href={`/contato?tipo=demo&solucao=${solution.slug}`} />}
              >
                Solicitar Demonstração
                <ArrowRight className="size-4" />
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
