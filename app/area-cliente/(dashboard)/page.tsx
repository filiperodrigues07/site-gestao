import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { isChApiConfigured } from "@/lib/ch-api/config";
import { listarReceber, isTituloPendente, ChApiError, type ChTituloReceber } from "@/lib/ch-api/client";
import { getReceberRange } from "@/lib/portal/receber-range";
import { PixButton } from "@/components/portal/pix-button";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pt-BR");
}

function isAtrasado(vencimento: string) {
  return new Date(`${vencimento}T00:00:00`).getTime() < new Date().setHours(0, 0, 0, 0);
}

async function loadTitulosPendentes(
  chaveCliente: number
): Promise<{ titulos: ChTituloReceber[]; error: string | null }> {
  if (!(await isChApiConfigured())) {
    return { titulos: [], error: "A consulta de títulos ainda está sendo configurada. Volte em breve." };
  }
  try {
    const [dataInicial, dataFinal] = getReceberRange();
    const todos = await listarReceber(dataInicial, dataFinal);
    const pendentes = todos
      .filter((titulo) => titulo.CHAVECLIFOR === chaveCliente && isTituloPendente(titulo))
      .sort((a, b) => a.VENCIMENTO.localeCompare(b.VENCIMENTO));
    return { titulos: pendentes, error: null };
  } catch (error) {
    const message =
      error instanceof ChApiError ? error.message : "Não foi possível consultar seus títulos agora.";
    return { titulos: [], error: message };
  }
}

export default async function AreaClientePage() {
  const client = await getCurrentPortalClient();
  const { titulos, error } = await loadTitulosPendentes(client.chaveCliente);

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Contas a receber</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Títulos em aberto de {client.razaoSocial} junto à Gestão.
      </p>

      <div className="mt-8">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!error && titulos.length === 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <p>Você está em dia — nenhum título em aberto no momento.</p>
          </div>
        )}

        {!error && titulos.length > 0 && (
          <ul className="space-y-3">
            {titulos.map((titulo) => (
              <li
                key={titulo.CHAVE}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
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
                  <PixButton
                    tituloChave={titulo.CHAVE}
                    documento={titulo.DOCUMENTO}
                    valorLabel={formatCurrency(titulo.VALOR)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
