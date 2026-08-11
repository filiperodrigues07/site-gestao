import { UpdateUploadForm } from "@/components/admin/update-upload-form";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovaNovidadePage() {
  await requirePermission("novidades");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Nova novidade</h1>
      <div className="mt-6">
        <UpdateUploadForm />
      </div>
    </div>
  );
}
