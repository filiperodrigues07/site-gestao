import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { INSTAGRAM_IMAGES_DIR } from "@/lib/uploads/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await db.query.instagramPosts.findFirst({ where: eq(instagramPosts.id, postId) });
  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), INSTAGRAM_IMAGES_DIR, row.storedFileName);
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
