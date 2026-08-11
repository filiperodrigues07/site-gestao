import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";
import { VIDEO_FILES_DIR } from "@/lib/uploads/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const videoId = Number(id);
  if (!Number.isInteger(videoId)) {
    return new Response("Not found", { status: 404 });
  }

  const row = await db.query.videos.findFirst({ where: eq(videos.id, videoId) });
  if (!row || row.sourceType !== "upload" || !row.storedFileName) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), VIDEO_FILES_DIR, row.storedFileName);
  let stat: fs.Stats;
  try {
    stat = await fsp.stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const totalSize = stat.size;
  const mimeType = row.mimeType ?? "video/mp4";
  const range = request.headers.get("range");

  if (!range) {
    const stream = fs.createReadStream(filePath);
    return new Response(fs.ReadStream.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(totalSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) {
    return new Response("Range inválido", { status: 416 });
  }

  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= totalSize) {
    return new Response("Range inválido", {
      status: 416,
      headers: { "Content-Range": `bytes */${totalSize}` },
    });
  }

  const stream = fs.createReadStream(filePath, { start, end });
  return new Response(fs.ReadStream.toWeb(stream) as ReadableStream, {
    status: 206,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${totalSize}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
