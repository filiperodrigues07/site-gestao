import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { promotions } from "@/lib/db/schema";
import { promotionMetadataSchema } from "@/lib/validations/admin/promotion-schema";
import { IMAGE_EXTENSION_MAP, MAX_IMAGE_SIZE_BYTES, PROMOTION_IMAGES_DIR } from "@/lib/uploads/constants";

export async function POST(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ success: false, errors: { _form: ["Não autenticado"] } }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, errors: { _form: ["Requisição inválida"] } }, { status: 400 });
  }

  const file = formData.get("file");
  const parsed = promotionMetadataSchema.safeParse({
    title: formData.get("title"),
    linkUrl: formData.get("linkUrl") ?? "",
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
  const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), PROMOTION_IMAGES_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

  const [row] = await db
    .insert(promotions)
    .values({
      title: parsed.data.title,
      linkUrl: parsed.data.linkUrl || null,
      storedFileName,
      originalFileName: file.name,
      mimeType: resolved.mime,
      sizeBytes: file.size,
    })
    .returning();

  revalidatePath("/");

  return NextResponse.json({ success: true, id: row.id });
}
