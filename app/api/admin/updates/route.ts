import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUserForApi } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { updates } from "@/lib/db/schema";
import { updateSchema } from "@/lib/validations/admin/update-schema";
import { IMAGE_EXTENSION_MAP, MAX_IMAGE_SIZE_BYTES, UPDATE_IMAGES_DIR } from "@/lib/uploads/constants";
import { processImageBuffer } from "@/lib/uploads/process-image";

export async function POST(request: Request) {
  const user = await getUserForApi();
  if (!user) {
    return NextResponse.json({ success: false, errors: { _form: ["Não autenticado"] } }, { status: 401 });
  }
  if (!hasPermission(user, "novidades")) {
    return NextResponse.json({ success: false, errors: { _form: ["Sem permissão"] } }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, errors: { _form: ["Requisição inválida"] } }, { status: 400 });
  }

  const parsed = updateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  let imageFields: {
    storedFileName: string;
    originalFileName: string;
    mimeType: string;
    sizeBytes: number;
  } | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          errors: { file: [`Imagem excede o limite de ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`] },
        },
        { status: 400 }
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    const resolved = IMAGE_EXTENSION_MAP[extension];
    if (!resolved) {
      return NextResponse.json(
        { success: false, errors: { file: ["Formato de imagem não permitido (use PNG, JPG, GIF ou WEBP)"] } },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[/\\?%*:|"<>]/g, "_");
    const storedFileName = `${randomUUID()}-${safeName}`;
    const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), UPDATE_IMAGES_DIR);
    await fs.mkdir(uploadDir, { recursive: true });
    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const buffer = await processImageBuffer(rawBuffer, resolved.mime);
    await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

    imageFields = {
      storedFileName,
      originalFileName: file.name,
      mimeType: resolved.mime,
      sizeBytes: buffer.length,
    };
  }

  const [row] = await db
    .insert(updates)
    .values({
      ...parsed.data,
      authorId: user.id,
      ...imageFields,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/novidades");

  return NextResponse.json({ success: true, id: row.id });
}
