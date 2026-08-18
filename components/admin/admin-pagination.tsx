import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function PagerLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm text-muted-foreground/50">
        {children}
      </span>
    );
  }
  return (
    <Button type="button" variant="outline" size="sm" nativeButton={false} render={<Link href={href} />}>
      {children}
    </Button>
  );
}

export function AdminPagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <PagerLink href={buildHref(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
          Anterior
        </PagerLink>
        <PagerLink href={buildHref(page + 1)} disabled={page >= totalPages}>
          Próxima
          <ChevronRight className="size-4" />
        </PagerLink>
      </div>
    </div>
  );
}
