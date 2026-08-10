import { DownloadUploadForm } from "@/components/admin/download-upload-form";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovoDownloadPage() {
  await requirePermission("downloads");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo download</h1>
      <div className="mt-6">
        <DownloadUploadForm />
      </div>
    </div>
  );
}
