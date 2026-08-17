import { getChApiConfig, type ChApiConfig } from "./config";

export class ChApiError extends Error {}

export type ChCliente = {
  CHAVE: number;
  CODIGO: string;
  RAZAOSOCIAL: string;
  FANTASIA: string;
  CNPJCPF: string;
  EMAIL: string;
};

export type ChTituloReceber = {
  CHAVE: number;
  ATIVO: number;
  DOCUMENTO: string;
  PARCELA: number;
  TOTPARC: number;
  VENCIMENTO: string;
  VALOR: number;
  CHAVECLIFOR: number;
  DESCRICAO: string;
  DATABAIXA: string | null;
  TITULOSUSTADO: string;
  LINHADIGBOL: string;
  CODBARRASBOL: string;
};

export type ChCobrancaPixGerada = {
  RECORD: string;
  IDPIX: string;
};

export type ChStatusCobrancaPix = {
  record: string;
  E2EPIX: string;
};

export type ChContaBancaria = {
  CHAVE: number;
  CODIGO: string;
  DESCRICAO: string;
  AGENCIA: string;
  CONTA: string;
  CHAVEBANCO: number;
  CHAVEPIX: string;
};

const REQUEST_TIMEOUT_MS = 15_000;

// A API do CH roda dentro do servidor da própria Gestão — pode estar fora do
// ar, lento, ou responder algo que não bate com a doc. Nunca deixamos um erro
// daqui quebrar a página: toda falha vira um ChApiError com mensagem amigável.
async function chFetch(
  path: string,
  method: "GET" | "POST" = "GET",
  explicitConfig?: ChApiConfig
): Promise<unknown> {
  const config = explicitConfig ?? (await getChApiConfig());
  const url = `${config.baseUrl}/datasnap/rest/TCHAPI/${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "X-Token": config.token,
        "X-ChaveEmpresa": config.chaveEmpresa,
      },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    console.error(`[ch-api] Falha ao conectar em ${url}${isTimeout ? " (timeout)" : ""}:`, error);
    throw new ChApiError(
      isTimeout
        ? "O servidor CH não respondeu a tempo (timeout de 15s). Verifique se o endereço está correto e acessível a partir daqui."
        : "Não foi possível conectar ao servidor CH. Verifique o endereço e se a porta está aberta/acessível a partir daqui."
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    console.error(`[ch-api] ${url} retornou HTTP ${response.status}:`, bodyText.slice(0, 500));

    // O CH costuma devolver { "erro": "motivo" } no corpo — mostra esse
    // motivo direto pro admin em vez de só o código HTTP.
    let motivo: string | null = null;
    try {
      const parsed = JSON.parse(bodyText) as { erro?: unknown };
      if (typeof parsed.erro === "string") motivo = parsed.erro;
    } catch {
      // corpo não é JSON — segue sem motivo detalhado
    }

    throw new ChApiError(
      motivo
        ? `O CH recusou a requisição: ${motivo}`
        : `Servidor CH retornou erro ${response.status}.`
    );
  }

  const data = await response.json().catch(() => null);
  const result = (data as { result?: unknown } | null)?.result;
  if (!Array.isArray(result)) {
    console.error(`[ch-api] Resposta inesperada de ${url}:`, JSON.stringify(data).slice(0, 500));
    throw new ChApiError("Resposta inesperada do servidor CH.");
  }
  return result;
}

// Endpoints de listagem (Cliente, Receber) devolvem `result` como um array
// contendo UM array de registros: [ [ {...}, {...} ] ].
async function chFetchList(path: string, explicitConfig?: ChApiConfig): Promise<Record<string, unknown>[]> {
  const result = await chFetch(path, "GET", explicitConfig);
  const rows = (result as unknown[])[0];
  if (!Array.isArray(rows)) {
    throw new ChApiError("Resposta inesperada do servidor CH.");
  }
  return rows as Record<string, unknown>[];
}

// Endpoints de Pix (GerarCobrancaPIX, ConsultarCobrancaPIX) devolvem `result`
// como um array contendo UM objeto direto: [ {...} ] (sem aninhamento extra).
async function chFetchObject(
  path: string,
  method: "GET" | "POST" = "GET",
  explicitConfig?: ChApiConfig
): Promise<Record<string, unknown>> {
  const result = await chFetch(path, method, explicitConfig);
  const item = (result as unknown[])[0];
  if (!item || typeof item !== "object") {
    throw new ChApiError("Resposta inesperada do servidor CH.");
  }

  // Erros de negócio (ex: chave Pix inválida) vêm com HTTP 200 e a mensagem
  // dentro do próprio objeto — em inglês ("error") nos endpoints de Pix,
  // em português ("erro") nos demais. Sem isso, o chamador só veria os
  // campos esperados (RECORD/IDPIX etc.) faltando, sem saber o motivo real.
  const record = item as Record<string, unknown>;
  const motivo = record.error ?? record.erro;
  if (typeof motivo === "string") {
    throw new ChApiError(`O CH recusou a requisição: ${motivo}`);
  }

  return record;
}

function formatChDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Usada só pelo botão "Testar conexão" da tela de configurações: usa os
// valores digitados no formulário direto (mesmo que ainda não salvos), sem
// depender do que já está gravado no banco.
export async function testarConexaoCh(config: ChApiConfig): Promise<{ totalClientes: number }> {
  const path = `Cliente/${config.cnpjEstrutura}/${config.chaveEmpresa}`;
  const rows = await chFetchList(path, config);
  return { totalClientes: rows.length };
}

// Usada pelo botão "Buscar contas bancárias" da tela de configurações — o
// admin costuma confundir esse campo com a chave Pix ou o CNPJ da conta,
// quando na verdade é a CHAVE interna do cadastro no CH (um número simples).
export async function listarContasBancarias(config: ChApiConfig): Promise<ChContaBancaria[]> {
  const path = `ContasBancarias/${config.cnpjEstrutura}/${config.chaveEmpresa}`;
  const rows = await chFetchList(path, config);
  return rows as unknown as ChContaBancaria[];
}

export async function listarClientes(): Promise<ChCliente[]> {
  const config = await getChApiConfig();
  const rows = await chFetchList(`Cliente/${config.cnpjEstrutura}/${config.chaveEmpresa}`);
  return rows as unknown as ChCliente[];
}

export async function listarReceber(dataInicial: Date, dataFinal: Date): Promise<ChTituloReceber[]> {
  const config = await getChApiConfig();
  const path = `Receber/${config.cnpjEstrutura}/${config.chaveEmpresa}/${formatChDate(dataInicial)}/${formatChDate(dataFinal)}`;
  const rows = await chFetchList(path);
  return rows as unknown as ChTituloReceber[];
}

export async function gerarCobrancaPix(valor: number): Promise<ChCobrancaPixGerada> {
  const config = await getChApiConfig();
  const valorFormatado = valor.toFixed(2);
  const path = `GerarCobrancaPIX/${config.cnpjEstrutura}/${config.chaveEmpresa}/${config.chaveContaBancaria}/${valorFormatado}`;
  const item = await chFetchObject(path, "POST");
  if (typeof item.RECORD !== "string" || typeof item.IDPIX !== "string") {
    throw new ChApiError("Resposta inesperada do servidor CH ao gerar a cobrança Pix.");
  }
  return { RECORD: item.RECORD, IDPIX: item.IDPIX };
}

export async function consultarCobrancaPix(idpix: string): Promise<ChStatusCobrancaPix> {
  const config = await getChApiConfig();
  const path = `ConsultarCobrancaPIX/${config.cnpjEstrutura}/${idpix}/${config.chaveEmpresa}/${config.chaveContaBancaria}`;
  const item = await chFetchObject(path, "GET");
  if (typeof item.record !== "string") {
    throw new ChApiError("Resposta inesperada do servidor CH ao consultar a cobrança Pix.");
  }
  return { record: item.record, E2EPIX: typeof item.E2EPIX === "string" ? item.E2EPIX : "" };
}

export async function cancelarCobrancaPix(idpix: string): Promise<void> {
  const config = await getChApiConfig();
  const path = `CancelarCobrancaPIX/${config.cnpjEstrutura}/${idpix}/${config.chaveEmpresa}/${config.chaveContaBancaria}`;
  await chFetch(path, "POST");
}

// Regra de "pendência" combinada com o auth check chaveCliente === CHAVECLIFOR
export function isTituloPendente(titulo: ChTituloReceber): boolean {
  return titulo.ATIVO === 1 && titulo.DATABAIXA === null && titulo.TITULOSUSTADO !== "S";
}
