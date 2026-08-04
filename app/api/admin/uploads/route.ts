import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { downloads } from "@/lib/db/schema";
import { downloadMetadataSchema } from "@/lib/validations/admin/download-schema";
import { EXTENSION_MAP, MAX_UPLOAD_SIZE_BYTES, UPLOAD_DIR } from "@/lib/uploads/constants";

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
  const parsed = downloadMetadataSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, errors: { file: ["Selecione um arquivo"] } },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json(
      { success: false, errors: { file: ["Arquivo excede o limite de 200MB"] } },
      { status: 400 }
    );
  }

  const extension = path.extname(file.name).toLowerCase();
  const resolved = EXTENSION_MAP[extension];
  if (!resolved) {
    return NextResponse.json(
      { success: false, errors: { file: ["Tipo de arquivo não permitido"] } },
      { status: 400 }
    );
  }

  const safeName = file.name.replace(/[/\\?%*:|"<>]/g, "_");
  const storedFileName = `${randomUUID()}-${safeName}`;
  const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), UPLOAD_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

  const [row] = await db
    .insert(downloads)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      fileType: resolved.type,
      storedFileName,
      originalFileName: file.name,
      mimeType: resolved.mime,
      sizeBytes: file.size,
    })
    .returning();

  revalidatePath("/base-de-conhecimento");

  return NextResponse.json({ success: true, id: row.id });
}
