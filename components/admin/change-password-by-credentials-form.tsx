"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePasswordByCredentialsSchema,
  type ChangePasswordByCredentialsFormValues,
} from "@/lib/validations/admin/user-schema";
import { changePasswordByCredentials } from "@/lib/actions/usuarios";

export function ChangePasswordByCredentialsForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordByCredentialsFormValues>({
    resolver: zodResolver(changePasswordByCredentialsSchema),
    defaultValues: { username: "", currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ChangePasswordByCredentialsFormValues) {
    const result = await changePasswordByCredentials(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Senha alterada com sucesso");
    reset();
    router.push("/admin/login");
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="username">Usuário</Label>
        <Input id="username" className="mt-2" autoComplete="username" {...register("username")} />
        {errors.username && (
          <p className="mt-1.5 text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="currentPassword">Senha atual</Label>
        <Input
          id="currentPassword"
          type="password"
          className="mt-2"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">Nova senha</Label>
        <Input
          id="newPassword"
          type="password"
          className="mt-2"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          className="mt-2"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="button" className="w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Alterar senha"}
      </Button>
    </div>
  );
}
