import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { VideoForm } from "@/components/admin/video-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";

export default async function EditarVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("videos");
  const { id } = await params;
  const video = await db.query.videos.findFirst({ where: eq(videos.id, Number(id)) });
  if (!video) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar vídeo</h1>
      <div className="mt-6">
        <VideoForm video={video} />
      </div>
    </div>
  );
}
