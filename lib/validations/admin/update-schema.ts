import { z } from "zod";

export const updateSchema = z.object({
  title: z.string().min(3, "Informe um título").max(160),
  description: z.string().min(5, "Informe uma descrição").max(1000),
});

export type UpdateFormValues = z.infer<typeof updateSchema>;
