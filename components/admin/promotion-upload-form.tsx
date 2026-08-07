"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  promotionMetadataSchema,
  type PromotionMetadata,
} from "@/lib/validations/admin/promotion-schema";

export function PromotionUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromotionMetadata>({
    resolver: zodResolver(promotionMetadataSchema),
    defaultValues: { title: "", linkUrl: "" },
  });

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return selected ? URL.createObjectURL(selected) : null;
    });
  }

  async function onSubmit(values: PromotionMetadata) {
    if (!file) {
      setFileError("Selecione uma imagem");
      return;
    }
    setFileError(null);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("linkUrl", values.linkUrl ?? "");
    formData.set("file", file);

    const response = await fetch("/api/admin/promotions", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok || !data.success) {
      const message = data?.errors?.file?.[0] ?? "Não foi possível enviar a imagem";
      toast.error(message);
      return;
    }

    toast.success("Promoção criada");
    router.push("/admin/promocoes");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="title">Título (uso interno, não aparece no site)</Label>
        <Input id="title" className="mt-2" placeholder="ex: Promoção MEI - Setembro" {...register("title")} />
        {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="linkUrl">Link ao clicar (opcional)</Label>
        <Input id="linkUrl" className="mt-2" placeholder="https://..." {...register("linkUrl")} />
        {errors.linkUrl && <p className="mt-1.5 text-sm text-destructive">{errors.linkUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="file">Imagem (PNG, JPG, GIF ou WEBP — até 50MB)</Label>
        <Input
          id="file"
          type="file"
          className="mt-2"
          accept=".png,.jpg,.jpeg,.gif,.webp"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Use imagens horizontais (ex: 1600×500px) — o banner na home é baixo e largo, e a
          imagem é cortada para preencher o espaço.
        </p>
        {fileError && <p className="mt-1.5 text-sm text-destructive">{fileError}</p>}
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Pré-visualização"
          className="max-h-80 w-auto rounded-lg border border-border object-contain"
        />
      )}

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar imagem"}
      </Button>
    </div>
  );
}
