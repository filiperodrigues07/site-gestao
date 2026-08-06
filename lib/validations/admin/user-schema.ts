import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Informe um nome").max(80),
  username: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(40)
    .regex(/^[a-z0-9._-]+$/, "Use apenas letras minúsculas, números, pontos, hífens e underscores"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

export type UserFormValues = z.infer<typeof userSchema>;
