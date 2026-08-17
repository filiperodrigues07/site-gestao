"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImportState =
  | { status: "idle" }
  | { status: "running"; imported: number; total: number };

type ImportEvent =
  | { total: number; imported: number; processed?: number }
  | { done: true; imported: number; skipped: number; senhaPadrao: string }
  | { done: true; error: string };

export function ImportChClientsButton() {
  const router = useRouter();
  const [state, setState] = useState<ImportState>({ status: "idle" });

  async function handleClick() {
    setState({ status: "running", imported: 0, total: 0 });

    try {
      const response = await fetch("/api/admin/portal-clientes/importar", { method: "POST" });
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        toast.error(body?.error ?? "Não foi possível importar os clientes do CH agora.");
        setState({ status: "idle" });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ImportEvent;

          if ("error" in event) {
            toast.error(event.error);
            setState({ status: "idle" });
            return;
          }

          if ("done" in event) {
            const skippedLabel = event.skipped > 0 ? `, ${event.skipped} já cadastrado(s)` : "";
            const senhaLabel = event.imported > 0 ? ` Senha padrão: ${event.senhaPadrao}` : "";
            toast.success(`${event.imported} cliente(s) importado(s) do CH${skippedLabel}.${senhaLabel}`);
            setState({ status: "idle" });
            router.refresh();
            return;
          }

          setState({ status: "running", imported: event.imported, total: event.total });
        }
      }
    } catch {
      toast.error("Não foi possível importar os clientes do CH agora.");
      setState({ status: "idle" });
    }
  }

  const isRunning = state.status === "running";
  const percent = isRunning && state.total > 0 ? Math.round((state.imported / state.total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" disabled={isRunning} onClick={handleClick}>
        <Download className="size-4" />
        {isRunning ? `Importando... ${percent}%` : "Importar do CH"}
      </Button>
      {isRunning && (
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
