"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { videoSchema, type VideoFormValues } from "@/lib/validations/admin/video-schema";
import { createVideo, updateVideo } from "@/app/admin/(dashboard)/videos/actions";
import type { Video } from "@/lib/db/schema";

export function VideoForm({ video }: { video?: Video }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
      videoUrl: video?.videoUrl ?? "",
      durationLabel: video?.durationLabel ?? "",
    },
  });

  async function onSubmit(values: VideoFormValues) {
    const result = video ? await updateVideo(video.id, values) : await createVideo(values);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(video ? "Vídeo atualizado" : "Vídeo criado");
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
        <Label htmlFor="videoUrl">URL de incorporação do YouTube</Label>
        <Input
          id="videoUrl"
          className="mt-2"
          placeholder="https://www.youtube.com/embed/VIDEO_ID"
          {...register("videoUrl")}
        />
        {errors.videoUrl && (
          <p className="mt-1.5 text-sm text-destructive">{errors.videoUrl.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="durationLabel">Duração</Label>
        <Input id="durationLabel" className="mt-2" placeholder="ex: 8 min" {...register("durationLabel")} />
        {errors.durationLabel && (
          <p className="mt-1.5 text-sm text-destructive">{errors.durationLabel.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : video ? "Salvar alterações" : "Criar vídeo"}
      </Button>
    </div>
  );
}
