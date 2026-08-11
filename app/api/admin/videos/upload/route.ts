import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUserForApi } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";
import { videoMetadataSchema } from "@/lib/validations/admin/video-schema";
import { VIDEO_EXTENSION_MAP, MAX_VIDEO_SIZE_BYTES, VIDEO_FILES_DIR } from "@/lib/uploads/constants";

export async function POST(request: Request) {
  const user = await getUserForApi();
  if (!user) {
    return NextResponse.json({ success: false, errors: { _form: ["Não autenticado"] } }, { status: 401 });
  }
  if (!hasPermission(user, "videos")) {
    return NextResponse.json({ success: false, errors: { _form: ["Sem permissão"] } }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, errors: { _form: ["Requisição inválida"] } }, { status: 400 });
  }

  const file = formData.get("file");
  const parsed = videoMetadataSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    durationLabel: formData.get("durationLabel"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, errors: { file: ["Selecione um arquivo de vídeo"] } },
      { status: 400 }
    );
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return NextResponse.json(
      {
        success: false,
        errors: { file: [`Vídeo excede o limite de ${MAX_VIDEO_SIZE_BYTES / (1024 * 1024)}MB`] },
      },
      { status: 400 }
    );
  }

  const extension = path.extname(file.name).toLowerCase();
  const resolved = VIDEO_EXTENSION_MAP[extension];
  if (!resolved) {
    return NextResponse.json(
      { success: false, errors: { file: ["Formato de vídeo não permitido (use MP4, WEBM ou MOV)"] } },
      { status: 400 }
    );
  }

  const safeName = file.name.replace(/[/\\?%*:|"<>]/g, "_");
  const storedFileName = `${randomUUID()}-${safeName}`;
  const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), VIDEO_FILES_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

  const [row] = await db
    .insert(videos)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      durationLabel: parsed.data.durationLabel,
      sourceType: "upload",
      storedFileName,
      originalFileName: file.name,
      mimeType: resolved.mime,
      sizeBytes: file.size,
      authorId: user.id,
    })
    .returning();

  revalidatePath("/base-de-conhecimento");

  return NextResponse.json({ success: true, id: row.id });
}
