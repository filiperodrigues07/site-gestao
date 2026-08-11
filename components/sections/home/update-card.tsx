"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Sparkles, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/icon-badge";
import type { Update } from "@/lib/db/schema";

const RECENT_DAYS = 7;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isRecent(iso: string) {
  const days = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  return days <= RECENT_DAYS;
}

export function UpdateCard({ update }: { update: Update }) {
  const hasImage = Boolean(update.storedFileName);
  const recent = isRecent(update.createdAt);

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger className="group/update flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-primary/40">
        {hasImage ? (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/updates/${update.id}/image`}
              alt=""
              className="size-full object-cover transition-transform duration-500 group-hover/update:scale-105"
            />
            {recent && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 bg-primary/90 text-primary-foreground"
              >
                Novo
              </Badge>
            )}
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3 p-6 pb-0">
            <IconBadge icon={Sparkles} className="bg-primary/10" />
            {recent && (
              <Badge variant="secondary" className="bg-primary/15 text-primary">
                Novo
              </Badge>
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-lg font-medium">{update.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{update.description}</p>
          <p className="mt-auto pt-5 text-xs text-muted-foreground/70">
            {formatDate(update.createdAt)}
          </p>
        </div>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-card outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {hasImage && (
            <div className="shrink-0 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/updates/${update.id}/image`}
                alt=""
                className="max-h-[45vh] w-full object-contain"
              />
            </div>
          )}
          <div className="overflow-y-auto p-6">
            {recent && (
              <Badge variant="secondary" className="bg-primary/15 text-primary">
                Novo
              </Badge>
            )}
            <h3 className="mt-3 font-heading text-xl font-medium text-balance">{update.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground/70">{formatDate(update.createdAt)}</p>
            <p className="mt-4 text-pretty whitespace-pre-wrap text-muted-foreground">
              {update.description}
            </p>
          </div>
          <DialogPrimitive.Close className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
