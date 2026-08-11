"use server";

import path from "node:path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { updates } from "@/lib/db/schema";
import { updateSchema, type UpdateFormValues } from "@/lib/validations/admin/update-schema";
import { UPDATE_IMAGES_DIR } from "@/lib/uploads/constants";

export async function updateUpdate(id: number, values: UpdateFormValues) {
  await requirePermission("novidades");
  const parsed = updateSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.update(updates).set(parsed.data).where(eq(updates.id, id));

  revalidatePath("/");
  revalidatePath("/admin/novidades");
  redirect("/admin/novidades");
}

export async function deleteUpdate(id: number) {
  await requirePermission("novidades");

  const row = await db.query.updates.findFirst({ where: eq(updates.id, id) });
  if (row?.storedFileName) {
    const filePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      UPDATE_IMAGES_DIR,
      row.storedFileName
    );
    await fs.unlink(filePath).catch(() => {});
  }
  await db.delete(updates).where(eq(updates.id, id));

  revalidatePath("/");
  revalidatePath("/admin/novidades");
  return {};
}
