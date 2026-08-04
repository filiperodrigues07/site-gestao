import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { db } from "@/lib/db/client";
import { deleteFAQ } from "./actions";

export default async function AdminFAQPage() {
  const rows = await db.query.faqs.findMany({
    orderBy: (f, { desc }) => desc(f.createdAt),
    with: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">FAQ</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} perguntas cadastradas</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/faq/novo" />}>
          <Plus className="size-4" />
          Nova pergunta
        </Button>
      </div>

      <div className="mt-6">
        <AdminList
          rows={rows}
          columns={[
            { header: "Pergunta", render: (row) => <span className="font-medium">{row.question}</span> },
            { header: "Categoria", render: (row) => row.category?.name ?? "—" },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/faq/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteFAQ.bind(null, row.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
