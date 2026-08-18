"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlugZap, Search, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  chApiSettingsSchema,
  type ChApiSettingsValues,
} from "@/lib/validations/admin/ch-api-settings-schema";
import {
  updateChApiSettings,
  testarConexaoChAction,
  listarContasBancariasChAction,
} from "@/lib/actions/ch-api-settings";
import type { ChApiSettings } from "@/lib/db/schema";
import type { ChContaBancaria } from "@/lib/ch-api/client";

export function ChApiSettingsForm({ settings }: { settings?: ChApiSettings }) {
  const [isTesting, startTest] = useTransition();
  const [isBuscandoContas, startBuscarContas] = useTransition();
  const [contas, setContas] = useState<ChContaBancaria[] | null>(null);
  const [showToken, setShowToken] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChApiSettingsValues>({
    resolver: zodResolver(chApiSettingsSchema),
    defaultValues: {
      baseUrl: settings?.baseUrl ?? "",
      token: settings?.token ?? "",
      chaveEmpresa: settings?.chaveEmpresa ?? "1",
      cnpjEstrutura: settings?.cnpjEstrutura ?? "",
      chaveContaBancaria: settings?.chaveContaBancaria ?? "",
    },
  });

  async function onSubmit(values: ChApiSettingsValues) {
    const result = await updateChApiSettings(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Configurações salvas");
  }

  function handleTest() {
    startTest(async () => {
      const parsed = chApiSettingsSchema.safeParse(getValues());
      if (!parsed.success) {
        toast.error("Preencha os campos corretamente antes de testar.");
        return;
      }
      const result = await testarConexaoChAction(parsed.data);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`Conexão OK — ${result.totalClientes} cliente(s) encontrado(s) no CH.`);
    });
  }

  function handleBuscarContas() {
    startBuscarContas(async () => {
      const { baseUrl, token, chaveEmpresa, cnpjEstrutura } = getValues();
      const result = await listarContasBancariasChAction({ baseUrl, token, chaveEmpresa, cnpjEstrutura });
      if ("error" in result) {
        toast.error(result.error);
        setContas(null);
        return;
      }
      if (result.contas.length === 0) {
        toast.error("Nenhuma conta bancária encontrada no CH.");
        setContas(null);
        return;
      }
      setContas(result.contas);
    });
  }

  function handleSelecionarConta(conta: ChContaBancaria) {
    setValue("chaveContaBancaria", String(conta.CHAVE));
    setContas(null);
    toast.success(`Conta selecionada: ${conta.DESCRICAO}`);
  }

  async function handleCopyToken() {
    const value = getValues("token");
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Token copiado");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="baseUrl">Endereço do CHServerWeb</Label>
        <Input
          id="baseUrl"
          className="mt-2"
          placeholder="localhost:8080 ou 192.168.0.10:8080"
          {...register("baseUrl")}
        />
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pode digitar só o endereço e a porta (sem http://) — completamos isso sozinhos.
        </p>
        {errors.baseUrl && <p className="mt-1.5 text-sm text-destructive">{errors.baseUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="token">X-Token</Label>
        <div className="relative mt-2">
          <Input id="token" type={showToken ? "text" : "password"} className="pr-20" {...register("token")} />
          <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowToken((v) => !v)}
              aria-label={showToken ? "Ocultar token" : "Mostrar token"}
              title={showToken ? "Ocultar token" : "Mostrar token"}
            >
              {showToken ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCopyToken}
              aria-label="Copiar token"
              title="Copiar token"
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Gerado em CHServer &gt; Configurações &gt; Integrador BI.
        </p>
        {errors.token && <p className="mt-1.5 text-sm text-destructive">{errors.token.message}</p>}
      </div>

      <div>
        <Label htmlFor="chaveEmpresa">Chave da empresa</Label>
        <Input id="chaveEmpresa" className="mt-2" {...register("chaveEmpresa")} />
        {errors.chaveEmpresa && (
          <p className="mt-1.5 text-sm text-destructive">{errors.chaveEmpresa.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cnpjEstrutura">CNPJ da estrutura principal</Label>
        <Input id="cnpjEstrutura" className="mt-2" placeholder="00000000000001" {...register("cnpjEstrutura")} />
        {errors.cnpjEstrutura && (
          <p className="mt-1.5 text-sm text-destructive">{errors.cnpjEstrutura.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="chaveContaBancaria">Chave da conta bancária (Pix)</Label>
        <div className="mt-2 flex gap-2">
          <Input id="chaveContaBancaria" {...register("chaveContaBancaria")} />
          <Button type="button" variant="secondary" disabled={isBuscandoContas} onClick={handleBuscarContas}>
            <Search className="size-4" />
            {isBuscandoContas ? "Buscando..." : "Buscar contas"}
          </Button>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Não é o CNPJ nem a chave Pix — é o número interno da conta cadastrada no CH. Use o botão
          &quot;Buscar contas&quot; pra não precisar adivinhar.
        </p>
        {errors.chaveContaBancaria && (
          <p className="mt-1.5 text-sm text-destructive">{errors.chaveContaBancaria.message}</p>
        )}

        {contas && (
          <ul className="mt-3 space-y-1.5 rounded-xl border border-border bg-muted/30 p-2">
            {contas.map((conta) => (
              <li key={conta.CHAVE}>
                <button
                  type="button"
                  onClick={() => handleSelecionarConta(conta)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="font-medium">{conta.DESCRICAO}</span>{" "}
                    <span className="text-muted-foreground">
                      — ag. {conta.AGENCIA} cc {conta.CONTA}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">chave {conta.CHAVE}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar configurações"}
        </Button>
        <Button type="button" variant="outline" onClick={handleTest} disabled={isTesting}>
          <PlugZap className="size-4" />
          {isTesting ? "Testando..." : "Testar conexão"}
        </Button>
      </div>
    </div>
  );
}
