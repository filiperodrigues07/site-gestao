"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importarClientesChAction } from "@/lib/actions/portal-clientes";

export function ImportChClientsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await importarClientesChAction();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      const skippedLabel = result.skipped > 0 ? `, ${result.skipped} já cadastrado(s)` : "";
      const senhaLabel = result.imported > 0 ? ` Senha padrão: ${result.senhaPadrao}` : "";
      toast.success(`${result.imported} cliente(s) importado(s) do CH${skippedLabel}.${senhaLabel}`);
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="outline" disabled={isPending} onClick={handleClick}>
      <Download className="size-4" />
      {isPending ? "Importando..." : "Importar do CH"}
    </Button>
  );
}
