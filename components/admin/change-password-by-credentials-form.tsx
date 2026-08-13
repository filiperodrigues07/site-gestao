"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";
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
        <div className="relative mt-2">
          <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="username" className="h-10 pl-9" autoComplete="username" {...register("username")} />
        </div>
        {errors.username && (
          <p className="mt-1.5 text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="currentPassword">Senha atual</Label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="currentPassword"
            type="password"
            className="h-10 pl-9"
            autoComplete="current-password"
            {...register("currentPassword")}
          />
        </div>
        {errors.currentPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">Nova senha</Label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="newPassword"
            type="password"
            className="h-10 pl-9"
            autoComplete="new-password"
            {...register("newPassword")}
          />
        </div>
        {errors.newPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
        <div className="relative mt-2">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            className="h-10 pl-9"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Alterar senha"}
      </Button>
    </div>
  );
}
