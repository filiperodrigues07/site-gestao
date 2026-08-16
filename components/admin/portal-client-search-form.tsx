"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCnpj } from "@/lib/portal/cnpj";
import {
  portalClientCreateSchema,
  type PortalClientCreateValues,
} from "@/lib/validations/admin/portal-client-schema";
import { buscarClienteChAction, createPortalClient } from "@/lib/actions/portal-clientes";
import type { ChCliente } from "@/lib/ch-api/client";

export function PortalClientSearchForm() {
  const router = useRouter();
  const [cnpjBusca, setCnpjBusca] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [cliente, setCliente] = useState<ChCliente | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortalClientCreateValues>({
    resolver: zodResolver(portalClientCreateSchema),
    defaultValues: { cnpj: "", razaoSocial: "", chaveCliente: 0, password: "" },
  });

  function handleSearch() {
    startSearch(async () => {
      const result = await buscarClienteChAction(cnpjBusca);
      if ("error" in result) {
        toast.error(result.error);
        setCliente(null);
        return;
      }
      setCliente(result.cliente);
      setValue("cnpj", result.cliente.CNPJCPF);
      setValue("razaoSocial", result.cliente.RAZAOSOCIAL);
      setValue("chaveCliente", result.cliente.CHAVE);
    });
  }

  async function onSubmit(values: PortalClientCreateValues) {
    const result = await createPortalClient(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Acesso criado");
    router.push("/admin/portal-clientes");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="cnpj-busca">CNPJ do cliente</Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="cnpj-busca"
            value={cnpjBusca}
            onChange={(event) => setCnpjBusca(event.target.value)}
            placeholder="00.000.000/0000-00"
          />
          <Button type="button" variant="secondary" disabled={isSearching} onClick={handleSearch}>
            <Search className="size-4" />
            {isSearching ? "Buscando..." : "Buscar no CH"}
          </Button>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Busca o cliente cadastrado no CH pelo CNPJ para confirmar o nome e vincular o acesso.
        </p>
      </div>

      {cliente && (
        <>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Cliente encontrado no CH</p>
            <p className="mt-1 font-medium">{cliente.RAZAOSOCIAL}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{formatCnpj(cliente.CNPJCPF)}</p>
          </div>

          <div>
            <Label htmlFor="password">Senha inicial de acesso</Label>
            <Input
              id="password"
              type="password"
              className="mt-2"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar acesso"}
          </Button>
        </>
      )}
    </div>
  );
}
