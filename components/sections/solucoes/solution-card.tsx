import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { getSolutionIcon } from "./solution-icons";
import type { Solution } from "@/data/solutions";

export function SolutionCard({
  solution,
  variant = "compact",
}: {
  solution: Solution;
  variant?: "compact" | "detailed";
}) {
  const Icon = getSolutionIcon(solution.iconKey);

  return (
    <Card className="group relative h-full overflow-hidden border-border/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <IconBadge icon={Icon} />
      <h3 className="mt-5 font-heading text-lg font-medium">{solution.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {variant === "detailed" ? solution.longDescription : solution.shortDescription}
      </p>
      <Link
        href={`/solucoes/${solution.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
      >
        Saiba mais
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
  );
}
