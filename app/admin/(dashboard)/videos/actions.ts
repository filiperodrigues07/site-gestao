"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";
import {
  youtubeVideoSchema,
  type YoutubeVideoFormValues,
  videoMetadataSchema,
  type VideoMetadataFormValues,
} from "@/lib/validations/admin/video-schema";
import { VIDEO_FILES_DIR } from "@/lib/uploads/constants";

export async function createVideo(values: YoutubeVideoFormValues) {
  const user = await requirePermission("videos");
  const parsed = youtubeVideoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.insert(videos).values({ ...parsed.data, sourceType: "youtube", authorId: user.id });

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function updateVideo(
  id: number,
  values: YoutubeVideoFormValues | VideoMetadataFormValues
) {
  await requirePermission("videos");

  const video = await db.query.videos.findFirst({ where: eq(videos.id, id) });
  if (!video) return { error: "Vídeo não encontrado" };

  if (video.sourceType === "youtube") {
    const parsed = youtubeVideoSchema.safeParse(values);
    if (!parsed.success) return { error: "Dados inválidos" };
    await db.update(videos).set(parsed.data).where(eq(videos.id, id));
  } else {
    const parsed = videoMetadataSchema.safeParse(values);
    if (!parsed.success) return { error: "Dados inválidos" };
    await db.update(videos).set(parsed.data).where(eq(videos.id, id));
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(id: number) {
  await requirePermission("videos");

  const video = await db.query.videos.findFirst({ where: eq(videos.id, id) });
  if (video?.sourceType === "upload" && video.storedFileName) {
    const filePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      VIDEO_FILES_DIR,
      video.storedFileName
    );
    await fs.unlink(filePath).catch(() => {});
  }

  await db.delete(videos).where(eq(videos.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  return {};
}
