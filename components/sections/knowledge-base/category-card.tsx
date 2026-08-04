import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/icon-badge";
import { getKbIcon } from "./kb-icons";
import type { KBCategory } from "@/data/knowledge-base/categories";

export function CategoryCard({ category }: { category: KBCategory }) {
  const Icon = getKbIcon(category.iconKey);

  return (
    <Link href={`/base-de-conhecimento?categoria=${category.slug}`}>
      <Card className="group h-full border-border/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <IconBadge icon={Icon} />
        <h3 className="mt-5 font-heading text-lg font-medium">
          {category.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {category.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Ver artigos
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}
