"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimpleLightbox({
  src,
  alt,
  children,
  className,
  suppressClick,
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
  /** Retorna true para ignorar o clique (ex: usuário acabou de arrastar). */
  suppressClick?: () => boolean;
}) {
  const [open, setOpen] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (suppressClick?.()) {
      e.preventDefault();
      return;
    }
    setOpen(true);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={handleClick}
        className={cn("group/lightbox relative block w-full cursor-zoom-in text-left", className)}
      >
        {children}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover/lightbox:bg-black/30 group-hover/lightbox:opacity-100">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm">
            <Expand className="size-4" strokeWidth={1.5} />
          </span>
        </span>
      </button>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div className="relative overflow-hidden rounded-2xl bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="max-h-[85vh] w-full object-contain" />
          </div>
          <DialogPrimitive.Close className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
