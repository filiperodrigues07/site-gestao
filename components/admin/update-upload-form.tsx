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
import { updateSchema, type UpdateFormValues } from "@/lib/validations/admin/update-schema";

export function UpdateUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { title: "", description: "" },
  });

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return selected ? URL.createObjectURL(selected) : null;
    });
  }

  async function onSubmit(values: UpdateFormValues) {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description);
    if (file) formData.set("file", file);

    const response = await fetch("/api/admin/updates", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok || !data.success) {
      const message = data?.errors?.file?.[0] ?? "Não foi possível publicar a novidade";
      toast.error(message);
      return;
    }

    toast.success("Novidade publicada");
    router.push("/admin/novidades");
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" className="mt-2" placeholder="ex: Novo módulo de relatórios" {...register("title")} />
        {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" className="mt-2 min-h-32" {...register("description")} />
        {errors.description && (
          <p className="mt-1.5 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="file">Imagem (opcional — PNG, JPG, GIF ou WEBP)</Label>
        <Input
          id="file"
          type="file"
          className="mt-2"
          accept=".png,.jpg,.jpeg,.gif,.webp"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Útil para repassar prints de comunicados de fornecedores (ex: novidades da CH Sistemas).
        </p>
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Pré-visualização"
          className="max-h-60 w-auto rounded-lg border border-border object-contain"
        />
      )}

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar novidade"}
      </Button>
    </div>
  );
}
