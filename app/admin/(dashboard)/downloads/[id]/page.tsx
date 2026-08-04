import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DownloadMetadataForm } from "@/components/admin/download-metadata-form";
import { db } from "@/lib/db/client";
import { downloads } from "@/lib/db/schema";

export default async function EditarDownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const download = await db.query.downloads.findFirst({ where: eq(downloads.id, Number(id)) });
  if (!download) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar download</h1>
      <div className="mt-6">
        <DownloadMetadataForm download={download} />
      </div>
    </div>
  );
}
