"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { promotions } from "@/lib/db/schema";
import { PROMOTION_IMAGES_DIR } from "@/lib/uploads/constants";

export async function deletePromotion(id: number) {
  await requirePermission("promocoes");

  const row = await db.query.promotions.findFirst({ where: eq(promotions.id, id) });
  if (row) {
    const filePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      PROMOTION_IMAGES_DIR,
      row.storedFileName
    );
    await fs.unlink(filePath).catch(() => {});
  }
  await db.delete(promotions).where(eq(promotions.id, id));

  revalidatePath("/");
  revalidatePath("/admin/promocoes");
  return {};
}
