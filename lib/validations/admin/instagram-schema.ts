import { z } from "zod";

export const instagramPostMetadataSchema = z.object({
  caption: z.string().min(3, "Informe uma legenda").max(500),
  postUrl: z.union([z.string().url("Informe uma URL válida"), z.literal("")]).optional(),
});

export type InstagramPostMetadata = z.infer<typeof instagramPostMetadataSchema>;
