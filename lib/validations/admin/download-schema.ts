import { z } from "zod";

export const downloadMetadataSchema = z.object({
  title: z.string().min(3, "Informe um título").max(160),
  description: z.string().min(5, "Informe uma descrição").max(500),
});

export type DownloadMetadata = z.infer<typeof downloadMetadataSchema>;
