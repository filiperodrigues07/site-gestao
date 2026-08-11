import { z } from "zod";

const YOUTUBE_EMBED_RE = /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]{6,20}(\?.*)?$/;

export const youtubeVideoSchema = z.object({
  title: z.string().min(3, "Informe um título").max(160),
  description: z.string().min(5, "Informe uma descrição").max(300),
  videoUrl: z
    .string()
    .url("Informe uma URL válida")
    .regex(
      YOUTUBE_EMBED_RE,
      "Use uma URL de incorporação do YouTube (https://www.youtube.com/embed/VIDEO_ID)"
    ),
  durationLabel: z.string().min(1, "Informe a duração").max(20),
});

export type YoutubeVideoFormValues = z.infer<typeof youtubeVideoSchema>;

export const videoMetadataSchema = z.object({
  title: z.string().min(3, "Informe um título").max(160),
  description: z.string().min(5, "Informe uma descrição").max(300),
  durationLabel: z.string().min(1, "Informe a duração").max(20),
});

export type VideoMetadataFormValues = z.infer<typeof videoMetadataSchema>;
