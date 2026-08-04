"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  downloadMetadataSchema,
  type DownloadMetadata,
} from "@/lib/validations/admin/download-schema";
import { updateDownloadMetadata } from "@/app/admin/(dashboard)/downloads/actions";
import type { Download } from "@/lib/db/schema";

export function DownloadMetadataForm({ download }: { download: Download }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DownloadMetadata>({
    resolver: zodResolver(downloadMetadataSchema),
    defaultValues: { title: download.title, description: download.description },
  });

  async function onSubmit(values: DownloadMetadata) {
    const result = await updateDownloadMetadata(download.id, values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Download atualizado");
    router.push("/admin/downloads");
  }

  return (
    <div className="max-w-lg space-y-5">
      <p className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
        Arquivo: <span className="font-medium text-foreground">{download.originalFileName}</span>.
        Para trocar o arquivo, exclua este download e envie um novo.
      </p>

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" className="mt-2" {...register("title")} />
        {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" className="mt-2" {...register("description")} />
        {errors.description && (
          <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
