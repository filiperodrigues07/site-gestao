import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/motion/reveal";
import { getSolutionBySlug } from "@/data/solutions";
import { getVendor } from "@/data/vendors";

export function SecullumShowcase() {
  const solution = getSolutionBySlug("secullum-ponto");
  const vendor = getVendor("secullum");
  if (!solution) return null;

  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5">
              <Image
                src={vendor.logo}
                alt={vendor.logoAlt}
                width={180}
                height={37}
                className="h-7 w-auto"
              />
            </span>
            <span className="mt-5 block text-sm font-medium tracking-wide text-primary uppercase">
              Parceria exclusiva
            </span>
            <h2 className="mt-2 font-heading text-display-3 font-medium text-balance">
              {solution.name}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {solution.shortDescription}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {solution.features.slice(0, 4).map((feature) => (
                <li key={feature} className="text-sm text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href={`/solucoes/${solution.slug}`} />}
              >
                Saiba mais sobre o Secullum Ponto
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
