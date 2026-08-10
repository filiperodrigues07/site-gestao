import { z } from "zod";
import { ADMIN_SECTIONS } from "@/lib/auth/permissions";

const sectionKeys = ADMIN_SECTIONS.map((s) => s.key) as [string, ...string[]];

export const userSchema = z.object({
  name: z.string().min(2, "Informe um nome").max(80),
  username: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(40)
    .regex(/^[a-z0-9._-]+$/, "Use apenas letras minúsculas, números, pontos, hífens e underscores"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
  isAdmin: z.boolean(),
  permissions: z.array(z.enum(sectionKeys)),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const userPermissionsSchema = z.object({
  isAdmin: z.boolean(),
  permissions: z.array(z.enum(sectionKeys)),
});

export type UserPermissionsFormValues = z.infer<typeof userPermissionsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const changePasswordByCredentialsSchema = z
  .object({
    username: z.string().min(1, "Informe seu usuário"),
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordByCredentialsFormValues = z.infer<
  typeof changePasswordByCredentialsSchema
>;
