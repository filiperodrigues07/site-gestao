import { z } from "zod";

export const portalClientCreateSchema = z.object({
  cnpj: z.string().min(11, "CNPJ inválido"),
  razaoSocial: z.string().min(1, "Informe a razão social"),
  chaveCliente: z.number().int().positive(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type PortalClientCreateValues = z.infer<typeof portalClientCreateSchema>;

export const portalClientUpdateSchema = z.object({
  isActive: z.boolean(),
  password: z.union([z.string().min(6, "A senha deve ter pelo menos 6 caracteres"), z.literal("")]),
});

export type PortalClientUpdateValues = z.infer<typeof portalClientUpdateSchema>;
