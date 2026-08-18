"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  portalChangePasswordSchema,
  type PortalChangePasswordValues,
} from "@/lib/validations/portal/change-password-schema";
import { trocarSenhaPortalAction } from "@/app/area-cliente/trocar-senha/actions";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortalChangePasswordValues>({
    resolver: zodResolver(portalChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: PortalChangePasswordValues) {
    const result = await trocarSenhaPortalAction(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Senha alterada com sucesso");
  }

  return (
    <div className="space-y-5">
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
