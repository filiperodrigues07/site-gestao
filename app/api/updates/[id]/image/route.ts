import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { updates } from "@/lib/db/schema";
import { UPDATE_IMAGES_DIR } from "@/lib/uploads/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = Number(id);
  if (!Number.isInteger(updateId)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await db.query.updates.findFirst({ where: eq(updates.id, updateId) });
  if (!row || !row.storedFileName || !row.mimeType || row.sizeBytes === null) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), UPDATE_IMAGES_DIR, row.storedFileName);
  try {
    await fsp.access(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const stream = fs.createReadStream(filePath);

  return new Response(fs.ReadStream.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(row.sizeBytes),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
