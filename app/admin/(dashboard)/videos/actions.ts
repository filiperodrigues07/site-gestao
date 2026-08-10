"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession, getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";
import { videoSchema, type VideoFormValues } from "@/lib/validations/admin/video-schema";

export async function createVideo(values: VideoFormValues) {
  const user = await getCurrentUser();
  const parsed = videoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.insert(videos).values({ ...parsed.data, authorId: user.id });

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function updateVideo(id: number, values: VideoFormValues) {
  await verifySession();
  const parsed = videoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.update(videos).set(parsed.data).where(eq(videos.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(id: number) {
  await verifySession();
  await db.delete(videos).where(eq(videos.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/videos");
  return {};
}
