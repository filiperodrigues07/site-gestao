"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { INSTAGRAM_IMAGES_DIR } from "@/lib/uploads/constants";

export async function deleteInstagramPost(id: number) {
  await requirePermission("instagram");

  const row = await db.query.instagramPosts.findFirst({ where: eq(instagramPosts.id, id) });
  if (row) {
    const filePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      INSTAGRAM_IMAGES_DIR,
      row.storedFileName
    );
    await fs.unlink(filePath).catch(() => {});
  }
  await db.delete(instagramPosts).where(eq(instagramPosts.id, id));

  revalidatePath("/");
  revalidatePath("/admin/instagram");
  return {};
}
