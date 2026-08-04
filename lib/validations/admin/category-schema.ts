import { z } from "zod";
import { KB_ICON_KEYS } from "@/components/sections/knowledge-base/kb-icons";

export const categorySchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  name: z.string().min(2, "Informe um nome").max(80),
  description: z.string().min(5, "Informe uma descrição").max(300),
  iconKey: z.enum(KB_ICON_KEYS),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
