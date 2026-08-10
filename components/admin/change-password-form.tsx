"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validations/admin/user-schema";
import { changeOwnPassword } from "@/lib/actions/usuarios";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    const result = await changeOwnPassword(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Senha alterada com sucesso");
    reset();
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="currentPassword">Senha atual</Label>
        <Input
          id="currentPassword"
          type="password"
          className="mt-2"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">Nova senha</Label>
        <Input id="newPassword" type="password" className="mt-2" {...register("newPassword")} />
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
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Alterar senha"}
      </Button>
    </div>
  );
}
