"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  instagramPostMetadataSchema,
  type InstagramPostMetadata,
} from "@/lib/validations/admin/instagram-schema";

export function InstagramUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstagramPostMetadata>({
    resolver: zodResolver(instagramPostMetadataSchema),
    defaultValues: { caption: "", postUrl: "" },
  });

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return selected ? URL.createObjectURL(selected) : null;
    });
  }

  async function onSubmit(values: InstagramPostMetadata) {
    if (!file) {
      setFileError("Selecione uma imagem");
      return;
    }
    setFileError(null);

    const formData = new FormData();
    formData.set("caption", values.caption);
    formData.set("postUrl", values.postUrl ?? "");
    formData.set("file", file);

    const response = await fetch("/api/admin/instagram", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok || !data.success) {
      const message = data?.errors?.file?.[0] ?? "Não foi possível enviar a imagem";
      toast.error(message);
      return;
    }

    toast.success("Publicação adicionada");
    router.push("/admin/instagram");
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="caption">Legenda</Label>
        <Textarea id="caption" className="mt-2" placeholder="ex: Confira nosso novo case de sucesso!" {...register("caption")} />
        {errors.caption && <p className="mt-1.5 text-sm text-destructive">{errors.caption.message}</p>}
      </div>

      <div>
        <Label htmlFor="postUrl">Link da publicação no Instagram (opcional)</Label>
        <Input id="postUrl" className="mt-2" placeholder="https://www.instagram.com/p/..." {...register("postUrl")} />
        {errors.postUrl && <p className="mt-1.5 text-sm text-destructive">{errors.postUrl.message}</p>}
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
          Use imagens quadradas (ex: 1080×1080px) para melhor aproveitamento no grid da home.
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
        {isSubmitting ? "Enviando..." : "Adicionar publicação"}
      </Button>
    </div>
  );
}
