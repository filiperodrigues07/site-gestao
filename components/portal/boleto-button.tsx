"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Copy, FileText, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoletoButton({
  documento,
  linhaDigitavel,
  valorLabel,
}: {
  documento: string;
  linhaDigitavel: string;
  valorLabel: string;
}) {
  const [open, setOpen] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(linhaDigitavel);
    toast.success("Linha digitável copiada");
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FileText className="size-3.5" />
        2ª via do boleto
      </Button>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <h3 className="font-heading text-lg font-medium">2ª via do boleto</h3>
          <p className="text-sm text-muted-foreground">
            Documento {documento} — {valorLabel}
          </p>
          <p className="w-full rounded-lg bg-muted p-3 text-left font-mono text-sm break-all text-muted-foreground">
            {linhaDigitavel}
          </p>
          <Button type="button" variant="secondary" className="w-full" onClick={handleCopy}>
            <Copy className="size-4" />
            Copiar linha digitável
          </Button>
          <DialogPrimitive.Close className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/10 text-foreground transition-colors hover:bg-black/20">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
