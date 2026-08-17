import { AlertTriangle, CheckCircle2, Wallet, FileClock, AlertCircle } from "lucide-react";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { isChApiConfigured } from "@/lib/ch-api/config";
import { listarReceber, isTituloPendente, ChApiError, type ChTituloReceber } from "@/lib/ch-api/client";
import { getReceberRange } from "@/lib/portal/receber-range";
import { TitulosList } from "@/components/portal/titulos-list";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

  const totalEmAberto = titulos.reduce((sum, t) => sum + t.VALOR, 0);
  const atrasados = titulos.filter((t) => isAtrasado(t.VENCIMENTO));

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Contas a receber</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Títulos em aberto de {client.razaoSocial} junto à Gestão.
      </p>

      {!error && titulos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4" />
              Total em aberto
            </div>
            <p className="mt-2 font-heading text-2xl font-medium">{formatCurrency(totalEmAberto)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileClock className="size-4" />
              Títulos em aberto
            </div>
            <p className="mt-2 font-heading text-2xl font-medium">{titulos.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div
              className={`flex items-center gap-2 text-sm ${atrasados.length > 0 ? "text-destructive" : "text-muted-foreground"}`}
            >
              <AlertCircle className="size-4" />
              Atrasados
            </div>
            <p className="mt-2 font-heading text-2xl font-medium">{atrasados.length}</p>
          </div>
        </div>
      )}

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

        {!error && titulos.length > 0 && <TitulosList titulos={titulos} />}
      </div>
    </div>
  );
}
