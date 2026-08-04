import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.email("Informe um e-mail válido"),
  phone: z.string().min(8, "Informe um telefone válido"),
  company: z.string().optional(),
  type: z.enum(["contato", "demo"]),
  solutionInterest: z.string().optional(),
  message: z.string().min(10, "Conte um pouco mais sobre o que você precisa"),
  // Honeypot: deve permanecer vazio — se preenchido, é um bot.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
