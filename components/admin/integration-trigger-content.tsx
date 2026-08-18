import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function IntegrationTriggerContent({
  logoSrc,
  logoAlt,
  name,
  description,
  connected,
}: {
  logoSrc: string;
  logoAlt: string;
  name: string;
  description: string;
  connected: boolean;
}) {
  return (
    <div className="flex flex-1 items-center gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
        <Image src={logoSrc} alt={logoAlt} width={241} height={89} className="h-auto w-full" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-heading text-base font-medium">{name}</p>
          {connected ? (
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Configurado
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Não configurado
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
