"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { importarArtigoDeUrlAction } from "@/app/admin/(dashboard)/artigos/actions";

export function ImportArticleFromUrlDialog({
  onImported,
}: {
  onImported: (data: { title: string; slug: string; excerpt: string; content: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleImport() {
    if (!url.trim()) {
      toast.error("Informe uma URL");
      return;
    }
    setIsLoading(true);
    const result = await importarArtigoDeUrlAction(url.trim());
    setIsLoading(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    onImported(result);
    toast.success("Conteúdo importado — revise tudo antes de salvar");
    setOpen(false);
    setUrl("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Globe className="size-4" />
        Importar de URL
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar artigo de uma URL</DialogTitle>
          <DialogDescription>
            Busca o conteúdo principal da página e converte para markdown, preenchendo os campos
            abaixo. Revise tudo antes de salvar.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="import-url">URL</Label>
          <Input
            id="import-url"
            className="mt-2"
            placeholder="https://exemplo.com/artigo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleImport} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
            {isLoading ? "Buscando..." : "Buscar conteúdo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
