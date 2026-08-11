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
  youtubeVideoSchema,
  type YoutubeVideoFormValues,
  videoMetadataSchema,
  type VideoMetadataFormValues,
} from "@/lib/validations/admin/video-schema";
import { createVideo, updateVideo } from "@/app/admin/(dashboard)/videos/actions";
import type { Video } from "@/lib/db/schema";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VideoForm({ video }: { video?: Video }) {
  if (video?.sourceType === "upload") {
    return <VideoMetadataOnlyForm video={video} />;
  }
  return <VideoYoutubeForm video={video} />;
}

function VideoYoutubeForm({ video }: { video?: Video }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<YoutubeVideoFormValues>({
    resolver: zodResolver(youtubeVideoSchema),
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
      videoUrl: video?.videoUrl ?? "",
      durationLabel: video?.durationLabel ?? "",
    },
  });

  async function onSubmit(values: YoutubeVideoFormValues) {
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

function VideoMetadataOnlyForm({ video }: { video: Video }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      durationLabel: video.durationLabel,
    },
  });

  async function onSubmit(values: VideoMetadataFormValues) {
    const result = await updateVideo(video.id, values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Vídeo atualizado");
    router.push("/admin/videos");
  }

  return (
    <div className="max-w-lg space-y-5">
      <p className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
        Arquivo: <span className="font-medium text-foreground">{video.originalFileName}</span>
        {video.sizeBytes ? ` (${formatSize(video.sizeBytes)})` : ""}. Para trocar o arquivo,
        exclua este vídeo e envie um novo.
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

      <div>
        <Label htmlFor="durationLabel">Duração</Label>
        <Input id="durationLabel" className="mt-2" placeholder="ex: 8 min" {...register("durationLabel")} />
        {errors.durationLabel && (
          <p className="mt-1.5 text-sm text-destructive">{errors.durationLabel.message}</p>
        )}
      </div>

      <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
