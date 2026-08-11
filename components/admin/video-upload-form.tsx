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
  videoMetadataSchema,
  type VideoMetadataFormValues,
} from "@/lib/validations/admin/video-schema";

export function VideoUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: { title: "", description: "", durationLabel: "" },
  });

  async function onSubmit(values: VideoMetadataFormValues) {
    if (!file) {
      setFileError("Selecione um arquivo de vídeo");
      return;
    }
    setFileError(null);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("durationLabel", values.durationLabel);
    formData.set("file", file);

    const data = await new Promise<{ success: boolean; errors?: Record<string, string[]> }>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/videos/upload");
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Resposta inválida"));
          }
        };
        xhr.onerror = () => reject(new Error("Falha de rede"));
        xhr.send(formData);
      }
    ).catch(() => null);

    setProgress(null);

    if (!data || !data.success) {
      const message = data?.errors?.file?.[0] ?? "Não foi possível enviar o vídeo";
      toast.error(message);
      return;
    }

    toast.success("Vídeo enviado com sucesso");
    router.push("/admin/videos");
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
        <Label htmlFor="durationLabel">Duração</Label>
        <Input id="durationLabel" className="mt-2" placeholder="ex: 8 min" {...register("durationLabel")} />
        {errors.durationLabel && (
          <p className="mt-1.5 text-sm text-destructive">{errors.durationLabel.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="file">Arquivo de vídeo (MP4, WEBM ou MOV — até 500MB)</Label>
        <Input
          id="file"
          type="file"
          className="mt-2"
          accept=".mp4,.webm,.mov"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {fileError && <p className="mt-1.5 text-sm text-destructive">{fileError}</p>}
      </div>

      {progress !== null && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? `Enviando${progress !== null ? ` (${progress}%)` : "..."}` : "Enviar vídeo"}
      </Button>
    </div>
  );
}
