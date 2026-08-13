import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUserForApi } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { instagramPostMetadataSchema } from "@/lib/validations/admin/instagram-schema";
import { IMAGE_EXTENSION_MAP, MAX_IMAGE_SIZE_BYTES, INSTAGRAM_IMAGES_DIR } from "@/lib/uploads/constants";
import { processImageBuffer } from "@/lib/uploads/process-image";

export async function POST(request: Request) {
  const user = await getUserForApi();
  if (!user) {
    return NextResponse.json({ success: false, errors: { _form: ["Não autenticado"] } }, { status: 401 });
  }
  if (!hasPermission(user, "instagram")) {
    return NextResponse.json({ success: false, errors: { _form: ["Sem permissão"] } }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, errors: { _form: ["Requisição inválida"] } }, { status: 400 });
  }

  const file = formData.get("file");
  const parsed = instagramPostMetadataSchema.safeParse({
    caption: formData.get("caption"),
    postUrl: formData.get("postUrl") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, errors: { file: ["Selecione uma imagem"] } },
      { status: 400 }
    );
  }

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
  const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), INSTAGRAM_IMAGES_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const rawBuffer = Buffer.from(await file.arrayBuffer());
  const buffer = await processImageBuffer(rawBuffer, resolved.mime);
  await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

  const [row] = await db
    .insert(instagramPosts)
    .values({
      caption: parsed.data.caption,
      postUrl: parsed.data.postUrl || null,
      storedFileName,
      originalFileName: file.name,
      mimeType: resolved.mime,
      sizeBytes: buffer.length,
    })
    .returning();

  revalidatePath("/");

  return NextResponse.json({ success: true, id: row.id });
}
