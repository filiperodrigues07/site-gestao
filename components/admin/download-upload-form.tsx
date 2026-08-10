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
  downloadMetadataSchema,
  type DownloadMetadata,
} from "@/lib/validations/admin/download-schema";

export function DownloadUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DownloadMetadata>({
    resolver: zodResolver(downloadMetadataSchema),
    defaultValues: { title: "", description: "" },
  });

  async function onSubmit(values: DownloadMetadata) {
    if (!file) {
      setFileError("Selecione um arquivo");
      return;
    }
    setFileError(null);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("file", file);

    const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok || !data.success) {
      const message = data?.errors?.file?.[0] ?? "Não foi possível enviar o arquivo";
      toast.error(message);
      return;
    }

    toast.success("Arquivo enviado com sucesso");
    router.push("/admin/downloads");
  }

  return (
    <div className="max-w-lg space-y-5">
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

      <div>
        <Label htmlFor="file">Arquivo (PDF, XLSX, DOCX, ZIP, RAR, EXE, MSI — até 200MB)</Label>
        <Input
          id="file"
          type="file"
          className="mt-2"
          accept=".pdf,.xlsx,.docx,.zip,.rar,.exe,.msi"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {fileError && <p className="mt-1.5 text-sm text-destructive">{fileError}</p>}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar arquivo"}
      </Button>
    </div>
  );
}
