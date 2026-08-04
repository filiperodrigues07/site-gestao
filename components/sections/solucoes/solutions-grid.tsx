import { RevealGroup } from "@/components/motion/reveal-group";
import { Reveal } from "@/components/motion/reveal";
import { SolutionCard } from "./solution-card";
import type { Solution } from "@/data/solutions";

export function SolutionsGrid({
  solutions,
  variant = "compact",
}: {
  solutions: Solution[];
  variant?: "compact" | "detailed";
}) {
  return (
    <RevealGroup
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      stagger={0.06}
    >
      {solutions.map((solution) => (
        <Reveal key={solution.id} as="div">
          <SolutionCard solution={solution} variant={variant} />
        </Reveal>
      ))}
    </RevealGroup>
  );
}
