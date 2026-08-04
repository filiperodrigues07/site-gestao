import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(5, "Informe a pergunta").max(200),
  answer: z.string().min(5, "Informe a resposta").max(1000),
  categoryId: z.number().int().positive().nullable(),
});

export type FAQFormValues = z.infer<typeof faqSchema>;
