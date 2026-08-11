import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { deleteVideo } from "./actions";

export default async function AdminVideosPage() {
  await requirePermission("videos");
  const rows = await db.query.videos.findMany({ orderBy: (v, { desc }) => desc(v.createdAt) });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Vídeos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} vídeos cadastrados</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/videos/novo" />}>
          <Plus className="size-4" />
          Novo vídeo
        </Button>
      </div>

      <div className="mt-6">
        <AdminList
          rows={rows}
          columns={[
            { header: "Título", render: (row) => <span className="font-medium">{row.title}</span> },
            {
              header: "Origem",
              render: (row) => (
                <Badge variant="secondary">
                  {row.sourceType === "upload" ? "Arquivo enviado" : "YouTube"}
                </Badge>
              ),
            },
            { header: "Duração", render: (row) => row.durationLabel },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/videos/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteVideo.bind(null, row.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
