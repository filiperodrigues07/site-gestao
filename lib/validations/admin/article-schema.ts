import { z } from "zod";

export const articleSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  title: z.string().min(3, "Informe um título").max(160),
  excerpt: z.string().min(5, "Informe um resumo").max(300),
  content: z.string().min(10, "O conteúdo é obrigatório"),
  categoryId: z.number().int().positive("Selecione uma categoria"),
  tags: z.string(), // comma-separated; split into an array before persisting
  status: z.enum(["draft", "published"]),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
