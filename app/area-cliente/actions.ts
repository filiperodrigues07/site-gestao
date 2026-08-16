"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { PORTAL_SESSION_COOKIE } from "@/lib/auth/portal-session";
import { listarReceber, gerarCobrancaPix, isTituloPendente, ChApiError } from "@/lib/ch-api/client";
import { getReceberRange } from "@/lib/portal/receber-range";

export async function portalLogoutAction() {
  (await cookies()).delete(PORTAL_SESSION_COOKIE);
  redirect("/area-cliente/login");
}

export type GerarPixResult = { record: string; qrCodeDataUrl: string } | { error: string };

// Não confia no valor mandado pelo cliente: refaz a consulta de títulos e só
// gera o Pix se o título ainda existir, ainda estiver pendente e pertencer
// mesmo ao cliente autenticado — o valor usado é sempre o que veio fresco do CH.
export async function gerarPixAction(tituloChave: number): Promise<GerarPixResult> {
  const client = await getCurrentPortalClient();

  try {
    const [dataInicial, dataFinal] = getReceberRange();
    const titulos = await listarReceber(dataInicial, dataFinal);
    const titulo = titulos.find(
      (t) => t.CHAVE === tituloChave && t.CHAVECLIFOR === client.chaveCliente && isTituloPendente(t)
    );
    if (!titulo) {
      return { error: "Título não encontrado ou já não está mais em aberto." };
    }

    const { RECORD } = await gerarCobrancaPix(titulo.VALOR);
    const qrCodeDataUrl = await QRCode.toDataURL(RECORD);
    return { record: RECORD, qrCodeDataUrl };
  } catch (error) {
    if (error instanceof ChApiError) return { error: error.message };
    return { error: "Não foi possível gerar a cobrança Pix. Tente novamente em instantes." };
  }
}
