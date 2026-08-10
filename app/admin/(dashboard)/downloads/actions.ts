"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { downloads } from "@/lib/db/schema";
import { downloadMetadataSchema, type DownloadMetadata } from "@/lib/validations/admin/download-schema";
import { UPLOAD_DIR } from "@/lib/uploads/constants";

export async function updateDownloadMetadata(id: number, values: DownloadMetadata) {
  await requirePermission("downloads");
  const parsed = downloadMetadataSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.update(downloads).set(parsed.data).where(eq(downloads.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/downloads");
  redirect("/admin/downloads");
}

export async function deleteDownload(id: number) {
  await requirePermission("downloads");

  const row = await db.query.downloads.findFirst({ where: eq(downloads.id, id) });
  if (row) {
    const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), UPLOAD_DIR, row.storedFileName);
    await fs.unlink(filePath).catch(() => {});
  }
  await db.delete(downloads).where(eq(downloads.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/downloads");
  return {};
}
