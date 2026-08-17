"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PixButton } from "@/components/portal/pix-button";
import { BoletoButton } from "@/components/portal/boleto-button";
import type { ChTituloReceber } from "@/lib/ch-api/client";

type StatusFilter = "todos" | "atrasados" | "em-dia";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pt-BR");
}

function isAtrasado(vencimento: string) {
  return new Date(`${vencimento}T00:00:00`).getTime() < new Date().setHours(0, 0, 0, 0);
}

export function TitulosList({ titulos }: { titulos: ChTituloReceber[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");

  const filtrados = useMemo(() => {
    const alvo = query.trim().toLowerCase();
    return titulos.filter((titulo) => {
      if (status === "atrasados" && !isAtrasado(titulo.VENCIMENTO)) return false;
      if (status === "em-dia" && isAtrasado(titulo.VENCIMENTO)) return false;
      if (!alvo) return true;
      return (
        titulo.DOCUMENTO.toLowerCase().includes(alvo) || titulo.DESCRICAO.toLowerCase().includes(alvo)
      );
    });
  }, [titulos, query, status]);

  const hasFilters = query.trim().length > 0 || status !== "todos";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por documento ou descrição..."
            className="h-9 pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="h-9 w-full sm:w-auto sm:min-w-40">
            <SelectValue>
              {(v: StatusFilter) =>
                v === "todos" ? "Status: todos" : v === "atrasados" ? "Atrasados" : "Em dia"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Status: todos</SelectItem>
            <SelectItem value="atrasados">Atrasados</SelectItem>
            <SelectItem value="em-dia">Em dia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        {filtrados.length === 0 ? (
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <p>{hasFilters ? "Nenhum título encontrado para esses filtros." : "Nada por aqui."}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtrados.map((titulo) => (
              <li
                key={titulo.CHAVE}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    Documento {titulo.DOCUMENTO}
                    {titulo.TOTPARC > 1 ? ` — parcela ${titulo.PARCELA}/${titulo.TOTPARC}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{titulo.DESCRICAO}</p>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      isAtrasado(titulo.VENCIMENTO) ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    Vencimento {formatDate(titulo.VENCIMENTO)}
                    {isAtrasado(titulo.VENCIMENTO) ? " — atrasado" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <p className="font-heading text-lg font-medium">{formatCurrency(titulo.VALOR)}</p>
                  <div className="flex items-center gap-2">
                    {titulo.LINHADIGBOL && (
                      <BoletoButton
                        documento={titulo.DOCUMENTO}
                        linhaDigitavel={titulo.LINHADIGBOL}
                        valorLabel={formatCurrency(titulo.VALOR)}
                      />
                    )}
                    <PixButton
                      tituloChave={titulo.CHAVE}
                      documento={titulo.DOCUMENTO}
                      valorLabel={formatCurrency(titulo.VALOR)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
