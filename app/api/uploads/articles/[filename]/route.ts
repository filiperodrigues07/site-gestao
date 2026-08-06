import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { ARTICLE_IMAGES_DIR, IMAGE_EXTENSION_MAP } from "@/lib/uploads/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Sanitiza: recusa qualquer coisa que tente escapar da pasta de uploads.
  if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(filename).toLowerCase();
  const resolved = IMAGE_EXTENSION_MAP[extension];
  if (!resolved) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), ARTICLE_IMAGES_DIR, filename);
  try {
    await fsp.access(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const stream = fs.createReadStream(filePath);

  return new Response(fs.ReadStream.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": resolved.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
