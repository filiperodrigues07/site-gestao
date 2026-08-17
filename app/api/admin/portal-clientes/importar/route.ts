import { NextResponse } from "next/server";
import { getUserForApi } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { listarClientes, ChApiError } from "@/lib/ch-api/client";
import { normalizeCnpj } from "@/lib/portal/cnpj";
import { SENHA_PADRAO_IMPORTACAO } from "@/lib/portal/constants";

// Streama o progresso (NDJSON, uma linha de evento por cliente processado) em
// vez de um Server Action de resposta única — com 1700+ clientes, o admin
// precisa ver que está avançando, não só uma tela travada em "Importando...".
export async function POST() {
  const user = await getUserForApi();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (!hasPermission(user, "portal-clientes")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      }

      try {
        const clientesCh = await listarClientes();
        send({ total: clientesCh.length, imported: 0 });

        const existentes = await db.query.portalClients.findMany({ columns: { cnpj: true } });
        const cnpjsExistentes = new Set(existentes.map((c) => c.cnpj));

        // Mesma senha padrão pra todo mundo nessa importação em massa — hash
        // uma vez só (scrypt é proposital e pesado; 1700x seria +1min à toa).
        const senhaPadraoHash = hashPassword(SENHA_PADRAO_IMPORTACAO);

        let imported = 0;
        for (let i = 0; i < clientesCh.length; i++) {
          const cliente = clientesCh[i];
          const cnpj = normalizeCnpj(cliente.CNPJCPF ?? "");
          if (cnpj.length >= 11 && !cnpjsExistentes.has(cnpj)) {
            await db.insert(portalClients).values({
              cnpj,
              razaoSocial: cliente.RAZAOSOCIAL,
              chaveCliente: cliente.CHAVE,
              passwordHash: senhaPadraoHash,
              isActive: true,
            });
            cnpjsExistentes.add(cnpj);
            imported += 1;
          }
          send({ total: clientesCh.length, imported, processed: i + 1 });
        }

        send({
          done: true,
          imported,
          skipped: clientesCh.length - imported,
          senhaPadrao: SENHA_PADRAO_IMPORTACAO,
        });
      } catch (error) {
        const message =
          error instanceof ChApiError ? error.message : "Não foi possível importar os clientes do CH agora.";
        send({ done: true, error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" },
  });
}
