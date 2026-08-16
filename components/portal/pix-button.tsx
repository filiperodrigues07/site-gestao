"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Copy, Loader2, QrCode, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gerarPixAction } from "@/app/area-cliente/actions";

type PixResult = { record: string; qrCodeDataUrl: string };

export function PixButton({
  tituloChave,
  documento,
  valorLabel,
}: {
  tituloChave: number;
  documento: string;
  valorLabel: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PixResult | null>(null);
  const [open, setOpen] = useState(false);

  function handleClick() {
    startTransition(async () => {
      const response = await gerarPixAction(tituloChave);
      if ("error" in response) {
        toast.error(response.error);
        return;
      }
      setResult(response);
      setOpen(true);
    });
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.record);
    toast.success("Código Pix copiado");
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <Button type="button" size="sm" disabled={isPending} onClick={handleClick}>
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <QrCode className="size-3.5" />}
        Gerar Pix
      </Button>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <h3 className="font-heading text-lg font-medium">Pagar com Pix</h3>
          <p className="text-sm text-muted-foreground">
            Documento {documento} — {valorLabel}
          </p>
          {result && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.qrCodeDataUrl} alt="QR Code Pix" className="size-56 rounded-lg" />
              <div className="w-full space-y-2">
                <p className="max-h-24 overflow-y-auto rounded-lg bg-muted p-3 text-left text-xs break-all text-muted-foreground">
                  {result.record}
                </p>
                <Button type="button" variant="secondary" className="w-full" onClick={handleCopy}>
                  <Copy className="size-4" />
                  Copiar código
                </Button>
              </div>
            </>
          )}
          <DialogPrimitive.Close className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/10 text-foreground transition-colors hover:bg-black/20">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
