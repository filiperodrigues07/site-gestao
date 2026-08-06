"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userSchema, type UserFormValues } from "@/lib/validations/admin/user-schema";
import { createUser } from "@/lib/actions/usuarios";

export function UserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  async function onSubmit(values: UserFormValues) {
    const result = await createUser(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Usuário criado");
    router.push("/admin/usuarios");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="username">Usuário (login)</Label>
        <Input id="username" className="mt-2" placeholder="ex: joao.silva" {...register("username")} />
        {errors.username && (
          <p className="mt-1.5 text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" className="mt-2" {...register("password")} />
        {errors.password && (
          <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Criar usuário"}
      </Button>
    </div>
  );
}
