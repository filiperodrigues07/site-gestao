"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/auth/permissions";
import { userSchema, type UserFormValues } from "@/lib/validations/admin/user-schema";
import { createUser } from "@/lib/actions/usuarios";

export function UserForm() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<AdminSection[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", username: "", password: "", isAdmin: false, permissions: [] },
  });

  function togglePermission(section: AdminSection) {
    setPermissions((current) =>
      current.includes(section) ? current.filter((s) => s !== section) : [...current, section]
    );
  }

  async function onSubmit(values: UserFormValues) {
    const result = await createUser({ ...values, isAdmin, permissions });
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

      <div className="rounded-xl border border-border p-4">
        <label className="flex items-center gap-2.5 text-sm font-medium">
          <Checkbox checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(checked === true)} />
          É administrador (acessa todas as telas, inclusive Usuários)
        </label>

        {!isAdmin && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm font-medium">Telas que este usuário pode acessar</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {ADMIN_SECTIONS.map((section) => (
                <label key={section.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={permissions.includes(section.key)}
                    onCheckedChange={() => togglePermission(section.key)}
                  />
                  {section.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Criar usuário"}
      </Button>
    </div>
  );
}
