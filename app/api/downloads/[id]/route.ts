import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { downloads } from "@/lib/db/schema";
import { UPLOAD_DIR } from "@/lib/uploads/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const downloadId = Number(id);
  if (!Number.isInteger(downloadId)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await db.query.downloads.findFirst({ where: eq(downloads.id, downloadId) });
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), UPLOAD_DIR, row.storedFileName);
  try {
    await fsp.access(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const encodedName = encodeURIComponent(row.originalFileName);
  const stream = fs.createReadStream(filePath);

  return new Response(fs.ReadStream.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(row.sizeBytes),
      "Content-Disposition": `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
    },
  });
}
