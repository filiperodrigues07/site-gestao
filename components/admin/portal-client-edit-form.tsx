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
import { formatCnpj } from "@/lib/portal/cnpj";
import {
  portalClientUpdateSchema,
  type PortalClientUpdateValues,
} from "@/lib/validations/admin/portal-client-schema";
import { updatePortalClient } from "@/lib/actions/portal-clientes";
import type { PortalClient } from "@/lib/db/schema";

export function PortalClientEditForm({ client }: { client: PortalClient }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(client.isActive);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortalClientUpdateValues>({
    resolver: zodResolver(portalClientUpdateSchema),
    defaultValues: { isActive: client.isActive, password: "" },
  });

  async function onSubmit(values: PortalClientUpdateValues) {
    const result = await updatePortalClient(client.id, { ...values, isActive });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Acesso atualizado");
    router.push("/admin/portal-clientes");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="font-medium">{client.razaoSocial}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{formatCnpj(client.cnpj)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">Chave do cliente no CH: {client.chaveCliente}</p>
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium">
        <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(checked === true)} />
        Acesso ativo
      </label>

      <div>
        <Label htmlFor="password">Redefinir senha</Label>
        <Input
          id="password"
          type="password"
          className="mt-2"
          autoComplete="new-password"
          placeholder="Deixe em branco para manter a senha atual"
          {...register("password")}
        />
        {errors.password && <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
