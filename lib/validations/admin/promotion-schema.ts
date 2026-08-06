import { z } from "zod";

export const promotionMetadataSchema = z.object({
  title: z.string().min(3, "Informe um título").max(160),
  linkUrl: z.union([z.string().url("Informe uma URL válida"), z.literal("")]).optional(),
});

export type PromotionMetadata = z.infer<typeof promotionMetadataSchema>;
