import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getUserForApi } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import {
  IMAGE_EXTENSION_MAP,
  MAX_IMAGE_SIZE_BYTES,
  ARTICLE_IMAGES_DIR,
  ARTICLE_IMAGES_PUBLIC_PATH,
} from "@/lib/uploads/constants";
import { processImageBuffer } from "@/lib/uploads/process-image";

export async function POST(request: NextRequest) {
  // Autenticação via X-API-Key (sistemas externos, ex.: RT HELPDESK) como
  // alternativa à sessão de admin no navegador — mesmo mecanismo usado pelas
  // rotas de /api/knowledge-base/*. Só entra nesse caminho se o header vier
  // preenchido; sem o header, o fluxo de sessão abaixo continua idêntico.
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    if (!process.env.KB_API_KEY || apiKey !== process.env.KB_API_KEY) {
      return NextResponse.json({ success: false, errors: { _form: ["Não autorizado"] } }, { status: 401 });
    }
  } else {
    const user = await getUserForApi();
    if (!user) {
      return NextResponse.json({ success: false, errors: { _form: ["Não autenticado"] } }, { status: 401 });
    }
    if (!hasPermission(user, "artigos")) {
      return NextResponse.json({ success: false, errors: { _form: ["Sem permissão"] } }, { status: 403 });
    }
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, errors: { _form: ["Requisição inválida"] } }, { status: 400 });
  }

  const file = formData.get("file");
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
  const uploadDir = path.join(/*turbopackIgnore: true*/ process.cwd(), ARTICLE_IMAGES_DIR);
  await fs.mkdir(uploadDir, { recursive: true });
  const rawBuffer = Buffer.from(await file.arrayBuffer());
  const buffer = await processImageBuffer(rawBuffer, resolved.mime);
  await fs.writeFile(path.join(uploadDir, storedFileName), buffer);

  return NextResponse.json({
    success: true,
    url: `${ARTICLE_IMAGES_PUBLIC_PATH}/${storedFileName}`,
  });
}
