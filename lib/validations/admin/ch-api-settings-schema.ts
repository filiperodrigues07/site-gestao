import { z } from "zod";

// Aceita tanto "http://exemplo.com:8080" quanto só "localhost:8080" ou
// "192.168.0.10:8080" — completa o esquema sozinho quando falta, já que o
// CHServerWeb normalmente é acessado só por IP/host:porta, sem HTTPS.
function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const chApiSettingsSchema = z.object({
  baseUrl: z
    .string()
    .min(1, "Informe o endereço do CHServerWeb")
    .transform(normalizeBaseUrl)
    .refine(isValidUrl, "Informe um endereço válido, ex: localhost:8080 ou 192.168.0.10:8080"),
  // .trim() nos quatro abaixo: copiar/colar do CHServer costuma trazer um
  // espaço ou quebra de linha grudado, e o CH rejeita como token inválido
  // sem avisar que é só um espaço a mais.
  token: z.string().trim().min(1, "Informe o X-Token gerado no CHServer"),
  chaveEmpresa: z.string().trim().min(1, "Informe a chave da empresa"),
  cnpjEstrutura: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length >= 11, "Informe o CNPJ da estrutura principal"),
  chaveContaBancaria: z.string().trim().min(1, "Informe a chave da conta bancária"),
});

export type ChApiSettingsValues = z.infer<typeof chApiSettingsSchema>;
